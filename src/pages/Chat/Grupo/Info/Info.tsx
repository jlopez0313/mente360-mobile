import { Link, useHistory, useParams } from "react-router-dom";

import { AppLayout } from "@/components/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NetworkContext } from "@/context/NetworkContext";
import { useBackButton } from "@/hooks/useBackButton";
import { getData, readData, snapshotToArray } from "@/services/realtime-db";
import { onValue } from "firebase/database";
import { ArrowLeft, UserPlus, Users } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";

const Info: React.FC = () => {
  const { id: groupId } = useParams<any>();
  const { baseURL, AvatarLogo } = useContext(NetworkContext);

  const history = useHistory();
  const modal = useRef<HTMLIonModalElement>(null);
  const usersCacheRef = useRef<{ [key: string]: any }>({});

  const [users, setUsers] = useState<any>([]);
  const [grupo, setGrupo] = useState<any>(null);
  const [presentingElement, setPresentingElement] =
    useState<HTMLElement | null>(null);

  const onGetGrupo = async (id: number) => {
    const data = await getData(`grupos/${id}`);
    const grupo = data.val();
    setGrupo({ grupo: grupo.grupo, photo: grupo.photo });
  };

  const dismiss = () => {
    modal.current?.dismiss();
  };

  const goToDetalle = () => {
    history.replace("");
  };

  useBackButton("/grupo" + groupId);

  useEffect(() => {
    let unsubRoom: any;

    const onGetRoom = async () => {
      unsubRoom = onValue(readData(`grupos/${groupId}`), async (snapshot) => {
        setGrupo({
          ...snapshot.val(),
          users: snapshotToArray(snapshot.val().users),
        });

        const users = snapshotToArray(snapshot.val().users);

        const promises = users.map(async (user: any) => {
          if (usersCacheRef.current[user.id]) {
            return usersCacheRef.current[user.id];
          }

          const data = await getData(`users/${user.id}`);
          const userData = data.val();

          usersCacheRef.current[user.id] = userData;
          return userData;
        });

        const listaUsuarios = await Promise.all(promises);

        console.log(listaUsuarios);
        setUsers(listaUsuarios);
      });
    };

    onGetRoom();

    return () => {
      unsubRoom();
    };
  }, [groupId]);

  return (
    <AppLayout hideNav>
      <div className="min-h-screen bg-background flex flex-col">
        <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 safe-top">
          <div className="flex items-center gap-3">
            <Link to={`/chat/`} replace={true}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>

            <Avatar className="w-10 h-10">
              <AvatarImage
                className="object-cover w-full h-full"
                src={grupo?.photo ? baseURL + grupo.photo : AvatarLogo}
                alt={grupo?.grupo}
              />
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                {grupo?.grupo.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h2 className="font-semibold text-foreground !mb-0 line-clamp-1">
                {grupo?.grupo}
              </h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <>
                  <Users className="w-3 h-3" />
                  {grupo?.users?.length} miembros
                </>
              </p>
            </div>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-12">
            <UserPlus className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">
              Ninguno usuario en este grupo aún
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {users.map((user: any) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    className="object-cover w-full h-full"
                    src={user.avatar}
                    alt={user.name}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h5 className="!m-0 font-semibold text-foreground truncate">
                    {user.name}
                  </h5>
                  <p className="text-sm text-muted-foreground">{user.phone}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Info;
