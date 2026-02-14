import { ContactDetailModal } from "@/components/Shared/Contact/ContactModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { NetworkContext } from "@/context/NetworkContext";
import { formatDate } from "@/helpers/Fechas";
import {
  queryTo,
  readData,
  snapshotToArray,
  writeData
} from "@/services/realtime-db";
import { setRoom } from "@/store/slices/notificationSlice";
import { onValue } from "firebase/database";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

export const Item = ({ usuario }: any) => {
  const { baseURL, AvatarLogo } = useContext(NetworkContext);
  const { user } = useSelector((state: any) => state.user);

  const history = useHistory();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [lastMsg, setLastMsg] = useState<any>(null);
  const [isWriting, setIsWriting] = useState<any>(false);
  const [unreads, setUnreads] = useState<any>(0);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const goToInterno = async () => {
    try {
      const roomArray = [Number(user.id), Number(usuario.id)];
      const roomID = roomArray.sort((a, b) => a - b).join("_");

      await writeData(`users/${user.id}/rooms/${roomID}`, true);
      await writeData(`users/${usuario.id}/rooms/${roomID}`, true);
      await writeData(`rooms/${roomID}/users/${user.id}/exit_time`, null);

      history.replace(`/chat/${roomID}`);
    } catch (error) {
      console.error("Error creando la sala de chat:", error);
    }
  };

  const handleAvatarClick = (contact: any) => {
    setSelectedContact(contact);
    setIsContactModalOpen(true);
  };

  useEffect(() => {
    const onCheckUnreads = () => {
      if (unreads != 0) {
        dispatch(setRoom(true));
      }
    };

    onCheckUnreads();
  }, [unreads]);

  useEffect(() => {
    let unsubLastMsg: any;
    let unsubTyping: any;
    let unsubUnreads: any;

    const onCheckStatus = async () => {
      const roomID = [Number(user.id), Number(usuario.id)]
        .sort((a, b) => a - b)
        .join("_");

      unsubLastMsg = onValue(
        queryTo(`rooms/${roomID}/messages`, {
          limit: 1,
          direction: "last",
        }),
        (snap) => {
          const lastMsg = snapshotToArray(snap.val());
          if (lastMsg.length) {
            setLastMsg({ ...lastMsg[0] });
          }
        }
      );

      unsubTyping = onValue(
        readData(`rooms/${roomID}/users/${usuario.id}/writing`),
        (snap) => {
          return setIsWriting(!!snap.val());
        }
      );

      unsubUnreads = onValue(
        readData(`rooms/${roomID}/users/${user.id}/unreads`),
        (snap) => {
          return setUnreads(snap.val());
        }
      );
    };

    onCheckStatus();

    return () => {
      unsubLastMsg();
      unsubTyping();
      unsubUnreads();
    };
  }, []);

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-all">
      <div
        className="relative"
        onClick={(e) => {
          e.preventDefault();
          handleAvatarClick(usuario);
        }}
      >
        <Avatar className="w-12 h-12">
          <AvatarImage
            className="object-cover w-full h-full"
            src={usuario?.photo ? baseURL + usuario?.photo : AvatarLogo}
            alt={usuario?.name}
          />
          <AvatarFallback className="bg-primary/10 text-primary">
            {usuario?.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        {usuario?.isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-card" />
        )}
      </div>
      <div onClick={goToInterno} className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h6 className="!m-0 font-semibold text-foreground truncate">
            {usuario?.name}
          </h6>
          <span className="text-xs text-muted-foreground">
            {lastMsg && lastMsg.date ? formatDate(lastMsg.date) : null}
          </span>
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {usuario?.lastMessage?.isFromMe && "Tú: "}
          {isWriting ? <i>Escribiendo...</i> : lastMsg?.mensaje}
        </p>
      </div>
      {unreads > 0 && (
        <Badge className="bg-primary text-primary-foreground">{unreads}</Badge>
      )}

      <ContactDetailModal
        contact={selectedContact}
        open={isContactModalOpen}
        onOpenChange={setIsContactModalOpen}
      />
    </div>
  );
};
