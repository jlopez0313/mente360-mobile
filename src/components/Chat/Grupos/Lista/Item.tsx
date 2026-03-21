import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { NetworkContext } from "@/context/NetworkContext";
import { formatDate } from "@/helpers/Fechas";
import {
  getData,
  queryTo,
  readData,
  snapshotToArray,
  writeData,
} from "@/services/realtime-db";
import { setGrupo } from "@/store/slices/notificationSlice";
import { onValue } from "firebase/database";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

export const Item = ({ grupo }: any) => {
  const { baseURL } = useContext(NetworkContext);

  const history = useHistory();
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.user);


  const [lastMsg, setLastMsg] = useState<any>(null);
  const [unreads, setUnreads] = useState<any>(0);
  const [isWriting, setIsWriting] = useState<any>(null);
  const [lastUser, setLastUser] = useState<any>(null);

  const goToGrupo = async () => {
    try {
      await writeData(`grupos/${grupo.id}/users/${user.id}/exit_time`, null);
      history.replace(`/grupo/${grupo.id}`);
    } catch (error) {
      console.error("Error creando el grupo de chat:", error);
    }
  };

  useEffect(() => {
    let unsubLastMsg: any;
    let unsubTyping: any;
    let unsubUnreads: any;
    let unsubMessages: any;

    const onCheckStatus = async () => {
      unsubLastMsg = onValue(
        queryTo(`grupos/${grupo.id}/messages`, {
          limit: 1,
          direction: "last",
        }),
        async (snap) => {
          const lastMsg = snapshotToArray(snap.val());
          if (lastMsg.length) {
            setLastMsg({ ...lastMsg[0] });

            const data = await getData(`users/${lastMsg[0].user}`);
            setLastUser(data.val());
          }
        }
      );

      unsubTyping = onValue(readData(`grupos/${grupo.id}/users`), async (snap) => {
        const usuarios = snapshotToArray(snap.val());
        const userWriting = usuarios.find((usuario: any) => usuario.writing);

        if (userWriting) {
          const data = await getData(`users/${userWriting.id}`);
          setLastUser(data.val());
        }

        return setIsWriting(userWriting);
      });

      unsubUnreads = onValue(
        readData(`grupos/${grupo.id}/users/${user.id}/exit_time`),
        (snapshot) => {
          const exitTime = snapshot.val();
          if (unsubMessages) unsubMessages();

          if (exitTime) {
            const unreadQuery = queryTo(`grupos/${grupo.id}/messages`, {
              orderBy: "date",
              startAt: exitTime,
            });

            unsubMessages = onValue(unreadQuery, (msgSnap) => {
              const messages = snapshotToArray(msgSnap.val());
              const count = messages.filter((m: any) => m.user !== user.id).length;
              setUnreads(count);
            });
          } else {
            // Si nunca ha entrado, todos los mensajes (de otros) cuentan como no leídos
            unsubMessages = onValue(readData(`grupos/${grupo.id}/messages`), (msgSnap) => {
              const messages = snapshotToArray(msgSnap.val());
              const count = messages.filter((m: any) => m.user !== user.id).length;
              setUnreads(count);
            });
          }
        }
      );
    };

    onCheckStatus();

    return () => {
      unsubLastMsg?.();
      unsubTyping?.();
      unsubUnreads?.();
      unsubMessages?.();
    };
  }, [grupo.id, user.id]);

  useEffect(() => {
    const onCheckUnreads = () => {
      if (unreads != 0) {
        dispatch(setGrupo(true));
      }
    };
    onCheckUnreads();
  }, [unreads]);

  return (
    <div
      onClick={goToGrupo}
      className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
    >
      <Avatar className="w-12 h-12">
        <AvatarImage
          className="object-cover w-full h-full"
          src={baseURL + grupo.photo}
          alt={grupo.grupo}
        />
        <AvatarFallback className="bg-primary/10 text-primary">
          {grupo?.grupo?.charAt(0) || ""}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h6 className="!m-0 font-semibold text-foreground truncate">
            {grupo.grupo}
          </h6>
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {lastUser?.name ? `${lastUser.name}: ` : ""}{isWriting ? <i>Escribiendo...</i> : lastMsg?.mensaje}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        {unreads > 0 && (
          <Badge className="bg-primary text-primary-foreground">
            {unreads}
          </Badge>
        )}
        <span className="text-xs text-muted-foreground">
          {lastMsg ? formatDate(lastMsg.date) : null}
        </span>
      </div>
    </div>
  );
};
