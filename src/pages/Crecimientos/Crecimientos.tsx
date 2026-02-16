import { Crecimiento as CrecimientoComponent } from "@/components/Crecimiento/Crecimiento";
import { AppLayout } from "@/components/layout";
import { ContactDetailModal } from "@/components/Shared/Contact/ContactModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NetworkContext } from "@/context/NetworkContext";
import Canales from "@/database/canales";
import Comunidades from "@/database/comunidades";
import Crecimiento from "@/database/crecimientos";
import Niveles from "@/database/niveles";
import User from "@/database/user";
import { destroy } from "@/helpers/musicControls";
import { useBackButton } from "@/hooks/useBackButton";
import { db } from "@/hooks/useDexie";
import { nextCrecimiento } from "@/services/user";
import { setShowGlobalAudio } from "@/store/slices/audioSlice";
import { setUser } from "@/store/slices/userSlice";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft } from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";

type Props = {
  nivel: Niveles | undefined;
  canal: Canales | undefined;
  comunidad: Comunidades | undefined;
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const Crecimientos: React.FC = () => {
  const { AudioNoWifi, baseURL, status } = useContext(NetworkContext);

  const history = useHistory();
  const { user } = useSelector((state: any) => state.user);

  const { id } = useParams<any>();
  const dispatch = useDispatch();

  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<Crecimiento | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const myCrecimiento = useMemo(() => {
    return user.crecimientos[0];
  }, [user]);

  const nivel = useLiveQuery(
    () => db.niveles.where("id").equals(Number(id)).first(),
    [id]
  );

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
          // swiper.slideTo(0);
          return lista;
        })
        .then((resultados: any[]) => {
          return resultados
            .filter((r: any) => r.nivel?.id == Number(id))
            .map((item: any) => {
              return { ...item, playing: false };
            });
        })
        .then((resultados: any[]) => {
          if (user.crecimientos_id) {
            const idx = resultados.findIndex(
              (x: any) => x.id == user.crecimientos_id
            );
            // swiper.slideTo(idx);
          }

          return resultados;
        }),
    [id]
  );

  const handleAvatarClick = (contact: any) => {
    setSelectedContact(contact);
    setIsContactModalOpen(true);
  };

  const onSaveNext = async (nextIdx: number) => {
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
    } else if (nextIdx == crecimientos?.length) {
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
        history.replace(
          `/niveles/${niveles[nextNivelIdx + 1]?.id}/crecimientos`
        );
      }
    }

    // await dispatch(setPodcast({ done: 1 }));
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
    dispatch(setShowGlobalAudio(true));

    return () => {
      destroy();
    };
  }, []);

  useBackButton(`/niveles/${id}/crecimientos`);

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
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4">
          <Link to={`/canales/${nivel?.canal?.id}/niveles`} replace={true}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
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
