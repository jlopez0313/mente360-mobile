import {
  DailyAudioCard,
  DailyContentGrid,
  DailyMessageModal,
  EneatipoModal,
  NightAudioModal,
  SOSModal,
  TaskProgress,
  WeeklyCalendar,
  WeeklyTaskModal,
} from "@/components/Home";
import { AppLayout } from "@/components/layout";
import { useContext, useEffect, useState } from "react";

import { mockUser } from "@/lib/mockData";
import { Settings, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

import { Sync } from "@/components/Shared/Animations/Sync/Sync";
import { NetworkContext } from "@/context/NetworkContext";
import { diferenciaEnDias } from "@/helpers/Fechas";
import { DB, localDB } from "@/helpers/localStore";
import { destroy } from "@/helpers/musicControls";
import { useCompletedItems } from "@/hooks/useCompletedItems";
import { useGlobalSync } from "@/hooks/useGlobalSync";
import { usePreferences } from "@/hooks/usePreferences";
import { update } from "@/services/user";
import { setShowGlobalAudio } from "@/store/slices/audioSlice";
import { setAdmin, setCurrentDay, setPodcast } from "@/store/slices/homeSlice";
import { setUser } from "@/store/slices/userSlice";
import { getHomeThunk } from "@/store/thunks/home";
import { getNotifications } from "@/store/thunks/notifications";
import { FCM } from "@capacitor-community/fcm";
import { useDispatch, useSelector } from "react-redux";

const Home: React.FC = () => {
  const { getPreference, setPreference, keys } = usePreferences();

  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const { completed, markComplete } = useCompletedItems();

  const { currentDay } = useSelector((state: any) => state.home);
  const dispatch = useDispatch();

  const { status, baseURL, AvatarLogo } = useContext(NetworkContext);
  const { loading, error, success, mensaje, syncAll } = useGlobalSync();

  const [nightAudioOpen, setNightAudioOpen] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);
  const [dailyMessageOpen, setDailyMessageOpen] = useState(false);
  const [weeklyTaskOpen, setWeeklyTaskOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useSelector((state: any) => state.user);

  const localHome = localDB(DB.HOME);
  const localData = localHome.get();

  const handleOpenModal = (
    modal: "nightAudio" | "sosEmotional" | "dailyMessage" | "weeklyTask"
  ) => {
    switch (modal) {
      case "nightAudio":
        setNightAudioOpen(true);
        break;
      case "sosEmotional":
        setSosOpen(true);
        break;
      case "dailyMessage":
        setDailyMessageOpen(true);
        break;
      case "weeklyTask":
        setWeeklyTaskOpen(true);
        break;
    }
  };

  useEffect(() => {
    const daysLeft = 7 - new Date().getDay();
    dispatch(setCurrentDay(daysLeft));
  }, []);

  useEffect(() => {
    const onGetNotifications = async () => {
      dispatch(getNotifications());
    };

    dispatch(setShowGlobalAudio(true));
    onGetNotifications();
    destroy();
  }, []);

  useEffect(() => {
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

    const onCheckEneatipo = () => {
      if (!user.eneatipo) {
        setIsOpen(true);
      }
    };
    onCheckEneatipo();

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
      <div className="safe-top">
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
            <div className="flex items-center gap-1 bg-accent/20 px-3 py-1.5 rounded-full">
              <Trophy className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-accent-foreground">
                {mockUser.stats.daysActive}
              </span>
            </div>
            <Link
              to="/configuracion"
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </Link>
          </div>
        </header>

        {/* Task Progress */}
        <TaskProgress daysRemaining={currentDay} />

        {/* Weekly Calendar */}
        <WeeklyCalendar
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
        />

        {/* Daily Content Grid */}
        <DailyContentGrid completed={completed} onOpenModal={handleOpenModal} />

        {/* Daily Audio */}
        <DailyAudioCard />
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
        isCompleted={completed.weeklyTask}
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
