import {
  CadenaDelBienCard,
  DailyAudioCard,
  DailyContentGrid,
  DailyMessageModal,
  EneatipoModal,
  FeaturedContentCard,
  NightAudioModal,
  RosarioCard,
  SOSModal,
  TaskProgress,
  WeeklyCalendar,
  WeeklyTaskModal,
} from "@/components/Home";
import { AppLayout } from "@/components/layout";
import { useContext, useEffect, useState } from "react";

import { Settings } from "lucide-react";
import { Link, useHistory } from "react-router-dom";

import { SuccessOverlay } from "@/components/Shared/Animations/Success/SuccessOverlay";
import { Sync } from "@/components/Shared/Animations/Sync/Sync";
import { NetworkContext } from "@/context/NetworkContext";
import { diferenciaEnDias } from "@/helpers/Fechas";
import { DB, localDB } from "@/helpers/localStore";
import { useCompletedItems } from "@/hooks/useCompletedItems";
import { db } from "@/hooks/useDexie";
import { useGlobalSync } from "@/hooks/useGlobalSync";
import { usePayment } from "@/hooks/usePayment";
import { usePreferences } from "@/hooks/usePreferences";
import { update } from "@/services/user";
import {
  setAdmin,
  setCadenaDelBien,
  setCurrentDay,
  setPodcast,
  setTarjetaDestacada,
} from "@/store/slices/homeSlice";
import { setUser } from "@/store/slices/userSlice";
import { getHomeThunk } from "@/store/thunks/home";
import { getNotifications } from "@/store/thunks/notifications";
import { FCM } from "@capacitor-community/fcm";
import { useLiveQuery } from "dexie-react-hooks";
import { useDispatch, useSelector } from "react-redux";

const Home: React.FC = () => {
  const { getPreference, setPreference, keys } = usePreferences();

  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const { completed, markComplete } = useCompletedItems();

  const { currentDay, cadenaDelBien, tarjetaDestacada } = useSelector(
    (state: any) => state.home,
  );
  const dispatch = useDispatch();
  const history = useHistory();

  const { status, baseURL, AvatarLogo } = useContext(NetworkContext);
  const { loading, error, success, mensaje, syncAll } = useGlobalSync();
  const { userEnabled, payment_status } = usePayment();

  const [nightAudioOpen, setNightAudioOpen] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);
  const [dailyMessageOpen, setDailyMessageOpen] = useState(false);
  const [weeklyTaskOpen, setWeeklyTaskOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const nightlyAudio = useLiveQuery(() => db.audios.toCollection().first());
  const weeklyTask = useLiveQuery(() => db.tareas.toCollection().first());
  const dailyMessage = useLiveQuery(() => db.mensajes.toCollection().first());
  const { podcast } = useSelector((state: any) => state.home);

  const { user } = useSelector((state: any) => state.user);

  const localHome = localDB(DB.HOME);
  const localData = localHome.get();

  const handleOpenModal = (
    modal: "nightAudio" | "sosEmotional" | "dailyMessage" | "weeklyTask",
  ) => {
    const isPrincipal = localStorage.getItem("principal");
    if (!isPrincipal) {
      history.push("/seleccionar-comunidad");
      return;
    }

    switch (modal) {
      case "nightAudio":
        if (!userEnabled || payment_status == "free") {
          history.push("/planes");
          return;
        }

        setNightAudioOpen(true);
        break;
      case "sosEmotional":
        if (!userEnabled || payment_status == "free") {
          history.push("/planes");
          return;
        }

        setSosOpen(true);
        break;
      case "dailyMessage":
        setDailyMessageOpen(true);
        break;
      case "weeklyTask":
        if (!userEnabled || payment_status == "free") {
          history.push("/planes");
          return;
        }

        setWeeklyTaskOpen(true);
        break;
    }
  };

  useEffect(() => {
    const onCompleteAll = () => {
      setShowSuccess(true);

      localHome.set({ ...localData, showSuccess: true });

      setTimeout(() => {
        setShowSuccess(false);
      }, 2500);
    };

    if (
      nightlyAudio?.done == 1 &&
      dailyMessage?.done == 1 &&
      weeklyTask?.done == 1 &&
      podcast.done &&
      !localData.showSuccess
    ) {
      onCompleteAll();
    }
  }, [nightlyAudio, dailyMessage, weeklyTask, podcast]);

  useEffect(() => {
    // Set current day
    const daysLeft = 7 - new Date().getDay();
    dispatch(setCurrentDay(daysLeft));

    // Get notifications
    const onGetNotifications = async () => {
      dispatch(getNotifications());
    };

    onGetNotifications();
    // destroy(); // REMOVED: This was killing the background controls on mount/return to home

    // Global sync
    const onGlobalSync = async () => {
      const lastDateStr =
        (await getPreference(keys.SYNC_KEY)) ?? "2024-01-01T00:00:00Z";
      const lastDate = new Date(lastDateStr);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (diferenciaEnDias(now, lastDate) > 0) {
        syncAll();
      }
    };

    onGlobalSync();

    // Check if user has eneatipo
    const onCheckEneatipo = () => {
      if (!user.eneatipo) {
        setIsOpen(true);
      }
    };
    onCheckEneatipo();

    // Update FCM token
    const onUpdateFCM = async () => {
      try {
        const token = await FCM.getToken();
        console.log("FCM Token:", token.token);
        console.log("USER:", user);

        const formData = {
          fcm_token: token.token,
        };

        const { data } = await update(formData, user.id);

        dispatch(setUser(data.data));
      } catch (error: any) {
        console.log(error);
      }
    };

    // Get home data
    const onGetHome = async () => {
      try {
        if (user.eneatipo) {
          const lastDateStr =
            (await getPreference(keys.HOME_SYNC_KEY)) ?? "2024-01-01T00:00:00Z";

          const lastDate = new Date(lastDateStr);
          const now = new Date();
          now.setHours(0, 0, 0, 0);

          if (diferenciaEnDias(now, lastDate) > 0) {
            await setPreference(keys.HOME_SYNC_KEY, now.toISOString());

            await dispatch(getHomeThunk());
          } else {
            dispatch(setPodcast(localData.podcast));
            dispatch(setAdmin(localData.admin));
            dispatch(setCadenaDelBien(localData.cadenaDelBien ?? {}));
            dispatch(setTarjetaDestacada(localData.tarjetaDestacada ?? {}));
          }
        }
      } catch (error: any) {
        console.log(error);
      }
    };

    if (status) {
      onUpdateFCM();
      onGetHome();
    }
  }, []);

  return (
    <AppLayout>
      <SuccessOverlay show={showSuccess} />

      <div className="h-full safe-top flex flex-col">
        {/* Header */}
        <header className="px-4 pt-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/perfil">
              <img
                src={status && user.photo ? baseURL + user.photo : AvatarLogo}
                alt={user?.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
              />
            </Link>
            <div>
              <p className="text-sm text-muted-foreground">Hola,</p>
              <h1 className="!m-0 font-display font-semibold text-lg text-foreground">
                {user?.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/*
            <div className="flex items-center gap-1 bg-accent/20 px-3 py-1.5 rounded-full">
              <Trophy className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-accent-foreground">
                {mockUser.stats.daysActive}
              </span>
            </div>
            */}
            <Link
              to="/configuracion"
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {/* Task Progress */}
          <TaskProgress daysRemaining={currentDay} />

          {/* Weekly Calendar */}
          <WeeklyCalendar
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
          />

          {/* Daily Content Grid */}
          <DailyContentGrid
            completed={{
              ...completed,
              weeklyTask: weeklyTask?.done === 1,
            }}
            onOpenModal={handleOpenModal}
          />

          {/* Cadena del Bien */}
          <CadenaDelBienCard
            titulo={cadenaDelBien?.titulo}
            descripcion={cadenaDelBien?.descripcion}
            link={cadenaDelBien?.link}
          />

          {/* Rosario en comunidad */}
          <RosarioCard />

          {/* Tarjeta destacada (dinámica, oculta si no hay contenido) */}
          <FeaturedContentCard
            titulo={tarjetaDestacada?.titulo}
            descripcion={tarjetaDestacada?.descripcion}
            tipo={tarjetaDestacada?.tipo}
            contenido_url={tarjetaDestacada?.contenido_url}
            link={tarjetaDestacada?.link}
          />

          {/* Daily Audio */}
          <DailyAudioCard />
        </div>
      </div>

      {/* Modals */}
      <NightAudioModal
        open={nightAudioOpen}
        onOpenChange={setNightAudioOpen}
        isCompleted={completed.nightAudio}
        onComplete={() => markComplete("nightAudio")}
      />

      <SOSModal
        open={sosOpen}
        onOpenChange={setSosOpen}
        isCompleted={completed.sosEmotional}
        onComplete={() => markComplete("sosEmotional")}
      />

      <DailyMessageModal
        open={dailyMessageOpen}
        onOpenChange={setDailyMessageOpen}
        isCompleted={completed.dailyMessage}
        onComplete={() => markComplete("dailyMessage")}
      />

      <WeeklyTaskModal
        open={weeklyTaskOpen}
        onOpenChange={setWeeklyTaskOpen}
        isCompleted={weeklyTask?.done === 1}
        onComplete={() => markComplete("weeklyTask")}
      />

      <EneatipoModal open={isOpen} onOpenChange={setIsOpen} />

      <Sync
        loading={loading}
        success={success}
        error={error}
        mensaje={mensaje}
      />
    </AppLayout>
  );
};

export default Home;
