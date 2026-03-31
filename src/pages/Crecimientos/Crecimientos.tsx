import { Crecimiento as CrecimientoComponent } from "@/components/Crecimiento/Crecimiento";
import { AppLayout } from "@/components/layout";
import { ContactDetailModal } from "@/components/Shared/Contact/ContactModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NetworkContext } from "@/context/NetworkContext";
import Crecimiento from "@/database/crecimientos";
import User from "@/database/user";
import { destroy } from "@/helpers/musicControls";
import { useBackButton } from "@/hooks/useBackButton";
import { db } from "@/hooks/useDexie";
import { nextCrecimiento } from "@/services/user";
import { setUser } from "@/store/slices/userSlice";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft } from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";



const Crecimientos: React.FC = () => {
  const { baseURL } = useContext(NetworkContext);

  const history = useHistory();
  const { user } = useSelector((state: any) => state.user);

  const { id } = useParams<any>();
  const dispatch = useDispatch();

  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<Crecimiento | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nivel = useLiveQuery(
    () => db.niveles.where("id").equals(Number(id)).first(),
    [id]
  );

  const myCrecimiento = useMemo(() => {
    return user.crecimientos?.find(
      (c: any) => c.nivel?.canales_id == nivel?.canal?.id || c.nivel?.canal?.id == nivel?.canal?.id
    );
  }, [user, nivel]);

  const niveles = useLiveQuery(
    () =>
      db.niveles
        .orderBy("orden")
        .filter((n: any) => n?.canal?.id == nivel?.canal?.id)
        .toArray(),
    [nivel]
  );

  const community = useLiveQuery(() => {
    if (!nivel) return;
    return db.comunidades
      .where("id")
      .equals(Number(nivel?.canal?.comunidades_id))
      .first();
  }, [nivel]);

  const crecimientos = useLiveQuery(
    () =>
      db.crecimientos
        .toArray()
        .then((lista: any[]) => {
          return lista;
        })
        .then((resultados: any[]) => {
          return resultados
            .filter((r: any) => r.nivel?.id == Number(id))
            .map((item: any) => {
              return { ...item, playing: false };
            });
        }),
    [id]
  );

  const handleAvatarClick = (contact: any) => {
    setSelectedContact(contact);
    setIsContactModalOpen(true);
  };

  const onSaveNext = async (nextIdx: number) => {
    const isLevelZero = nivel?.orden === 0 || nivel?.nivel === "Nivel 0";
    const currentAudioTitle = crecimientos?.[currentIndex]?.titulo ?? "";
    const regex = new RegExp(`eneatipo\\s*${user.eneatipo}`, "i");
    const isEneatipoMatch = regex.test(currentAudioTitle);

    // If it's the last audio of the level, or if it's Level 0 and we finished the first audio or the eneatipo audio,
    // we unlock the next level but DON'T force navigate if there are more audios.
    const isLastAudio = nextIdx === crecimientos?.length;
    const isEneatipoInZero = isLevelZero && isEneatipoMatch;
    const isFirstAudioInZero = isLevelZero && currentIndex === 0;

    const shouldUnlockNextLevel = isLastAudio || isEneatipoInZero || isFirstAudioInZero;

    if (shouldUnlockNextLevel) {
      const nextNivelIdx = niveles?.findIndex((n) => n.id == Number(id)) ?? -1;

      if (niveles && niveles[nextNivelIdx + 1]) {
        const updatePromise = nextCrecimiento(
          {
            niveles_id: niveles[nextNivelIdx + 1]?.id,
          },
          user.id
        );

        const setUserPromise = updatePromise.then(({ data }) => {
          return dispatch(setUser(data.data));
        });

        await Promise.all([updatePromise, setUserPromise]);

        // Only redirect IF it's the last audio and NOT Level 0 (Level 0 behaves like others now)
        // Actually, user wants Level 0 to behave like others, so only redirect if it's the last audio of ANY level.
        if (isLastAudio) {
          history.replace(
            `/niveles/${niveles[nextNivelIdx + 1]?.id}/crecimientos`
          );
          return;
        }
      }
    }

    // Normal progression to the next audio in the same level
    if (crecimientos && crecimientos[nextIdx]) {
      const updatePromise = nextCrecimiento(
        {
          crecimientos_id: crecimientos[nextIdx].id,
        },
        user.id
      );

      const setUserPromise = updatePromise.then(({ data }) => {
        return dispatch(setUser(data.data));
      });

      await Promise.all([updatePromise, setUserPromise]);
    }
  };

  useEffect(() => {
    if (!crecimientos?.length) return;

    const index = crecimientos.findIndex((c) => c.id == myCrecimiento?.id);
    if (index === -1) {
      setCurrentAudio(crecimientos[0]);
      setCurrentIndex(0);
    } else {
      setCurrentAudio(crecimientos[index]);
      setCurrentIndex(index);
    }
  }, [crecimientos, myCrecimiento]);

  useEffect(() => {
    return () => {
      destroy();
    };
  }, []);

  useBackButton(`/canales/${nivel?.canal?.id}/niveles`);

  if (!nivel) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Nivel no encontrado</p>
        </div>
      </AppLayout>
    );
  }

  if (!crecimientos?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No hay contenido aún en este nivel
        </p>
      </div>
    );
  }

  return (
    <AppLayout hideNav>
      <div className="h-full bg-gradient-to-b from-primary/5 to-background flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={() => history.replace(`/canales/${nivel?.canal?.id}/niveles`)}>
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <span className="text-sm text-muted-foreground font-medium">
            {community?.comunidad}
          </span>

          <Avatar
            className="w-10 h-10"
            onClick={(e) => {
              e.preventDefault();
              handleAvatarClick(community?.lider);
            }}
          >
            <AvatarImage
              className="object-cover w-full h-full"
              src={baseURL + community?.lider?.photo}
              alt={community?.lider?.name}
            />
            <AvatarFallback>{community?.lider?.name[0]}</AvatarFallback>
          </Avatar>
        </div>

        <CrecimientoComponent
          currentIndex={currentIndex}
          crecimientos={crecimientos}
          currentAudio={currentAudio}
          nivel={nivel}
          onSaveNext={onSaveNext}
          setCurrentIndex={setCurrentIndex}
          setCurrentAudio={setCurrentAudio}
        />
      </div>

      <ContactDetailModal
        contact={selectedContact}
        open={isContactModalOpen}
        onOpenChange={setIsContactModalOpen}
      />
    </AppLayout>
  );
};

export default Crecimientos;
