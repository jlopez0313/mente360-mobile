import { Link, useHistory, useParams, useLocation } from "react-router-dom";

import { useContext, useEffect, useState } from "react";

import { ChatInput } from "@/components/Chat/ChatInput";
import { Emojis } from "@/components/Chat/Emojis";
import { Grupo as GrupoComponent } from "@/components/Chat/Grupos/Grupo/Grupo";
import { ContactDetailModal } from "@/components/Chat/Grupos/Grupo/Info/ContactDetailModal";
import {
  AddMemberSheet,
  GroupMembersSheet,
  LeaveGroupDialog,
} from "@/components/Chat/Grupos/Grupo/modals";
import { AppLayout } from "@/components/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NetworkContext } from "@/context/NetworkContext";
import { useBackButton } from "@/hooks/useBackButton";
import { sendPush } from "@/services/push";
import {
  addData,
  doDisconnect,
  getData,
  readData,
  removeData,
  snapshotToArray,
  writeData,
} from "@/services/realtime-db";
import { onValue } from "firebase/database";
import {
  ArrowLeft,
  LogOut,
  MoreVertical,
  UserPlus,
  Users
} from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const Grupo: React.FC = () => {
  const { baseURL, AvatarLogo } = useContext(NetworkContext);
  const { user } = useSelector((state: any) => state.user);

  const history = useHistory();

  const { id: groupId } = useParams<any>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const msgId = queryParams.get('msgId');
  
  const [newMessage, setNewMessage] = useState("");

  const [removed, setRemoved] = useState(false);
  const [grupo, setGrupo] = useState<any>(null);
  const [lastUser, setLastUser] = useState<any>(null);
  const [isWriting, setIsWriting] = useState<any>(null);
  const [replyTo, setReplyTo] = useState<any>(null);
  const [otherUser, setOtherUser] = useState<any>({});
  const [showEmojiModal, setShowEmojiModal] = useState(false);

  const [showMembers, setShowMembers] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);


  const onCheckInput = async (e: any) => {
    setNewMessage(e.target.value);

    const writingStatus = e.target.value ? true : false;
    await writeData(
      `grupos/${groupId}/users/${user.id}/writing`,
      writingStatus
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const fecha = new Date();

      const message = {
        user: user.id,
        fecha: fecha.toLocaleDateString(),
        hora: fecha.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: fecha.toISOString(),
        mensaje: newMessage,
        reply: {
          id: replyTo?.id ?? null,
          from: replyTo?.user ?? null,
          mensaje: replyTo?.mensaje ?? null,
        },
      };

      setNewMessage("");
      setReplyTo(null);

      const otherUsers = grupo.users.filter((x: any) => x.id != user.id) || [];

      const sendPushPromise =
        otherUsers.length > 0
          ? sendPush({
            users_id: otherUsers.map((u: any) => u.id),
            title: grupo.grupo,
            description:
              (user.name + ": " + message.mensaje).length > 25
                ? `${user.name}: ${message.mensaje.substring(0, 22)}...`
                : `${user.name}: ${message.mensaje}`,
            grupo: groupId,
          })
          : Promise.resolve();

      await Promise.all([
        addData(`grupos/${groupId}/messages`, message),
        writeData(`grupos/${groupId}/users/${user.id}/writing`, false),
        sendPushPromise,
      ]);

      // requestAnimationFrame(() => scrollToBottom());
    } catch (error) {
      console.error("Error enviando mensaje al grupo:", error);
    }
  };

  const onExitGroup = async () => {
    await removeData(`users/${user.id}/grupos/${groupId}`);
    toast.success(`Has salido del grupo ${grupo.grupo}`);
    setRemoved(true);

    history.replace("/chat");
  };

  useEffect(() => {
    let unsubRoom: any;
    let unsubTyping: any;

    const onGetRoom = async () => {
      unsubRoom = onValue(readData(`grupos/${groupId}`), async (snapshot) => {
        setGrupo({
          ...snapshot.val(),
          users: snapshotToArray(snapshot.val().users),
        });
      });

      unsubTyping = onValue(
        readData(`grupos/${groupId}/users`),
        async (snap) => {
          const usuarios = snapshotToArray(snap.val());
          const userWriting = usuarios.find((usuario: any) => usuario.writing);

          if (userWriting) {
            const data = await getData(`users/${userWriting.id}`);
            setLastUser(data.val());
          }

          return setIsWriting(userWriting);
        }
      );
    };

    onGetRoom();

    return () => {
      unsubRoom && unsubRoom();
      unsubTyping && unsubTyping();
    };
  }, [groupId]);

  // Al entrar al chat
  useEffect(() => {
    const onEnter = async () => {
      if (!groupId || !user) return;

      await writeData(`grupos/${groupId}/users/${user.id}/exit_time`, null);
      await writeData(`grupos/${groupId}/users/${user.id}/unreads`, 0);
    };
    onEnter();

    const onDisconnect = () => {
      try {
        doDisconnect(`grupos/${groupId}/users/${user.id}`, {
          writing: false,
          exit_time: new Date().toISOString(),
          unreads: 0,
        });
      } catch (error) {
        console.error(error);
      }
    };
    onDisconnect();

    return () => {
      const onExit = async () => {
        await writeData(`grupos/${groupId}/users/${user.id}/writing`, false);
        await writeData(
          `grupos/${groupId}/users/${user.id}/exit_time`,
          new Date().toISOString()
        );
      };

      onExit();
    };
  }, [user, groupId]);

  useEffect(() => {
    let unsubUsers: any;

    const onGetOtherUser = () => {
      unsubUsers = onValue(
        readData(`users/${replyTo?.reply?.from}`),
        async (snapshot) => {
          setOtherUser({ ...snapshot.val() });
        }
      );
    };

    onGetOtherUser();

    return () => {
      unsubUsers();
    };
  }, [replyTo]);

  useBackButton("/chat");

  return (
    <AppLayout>
      <div className="h-full bg-background flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3.5 safe-top">
          <div className="flex items-center gap-3">
            <Link to={`/chat/`} replace={true}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </Button>
            </Link>

            <Avatar className="w-10 h-10">
              <AvatarImage
                className="object-cover w-full h-full"
                src={grupo?.photo ? baseURL + grupo.photo : AvatarLogo}
                alt={grupo?.grupo}
              />
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                {grupo?.grupo?.charAt(0) || ""}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h2 className="font-semibold text-foreground !mb-0 line-clamp-1">
                {grupo?.grupo}
              </h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {isWriting && lastUser?.name ? (
                  <>
                    {" "}
                    {lastUser?.name}: <i>Escribiendo...</i>{" "}
                  </>
                ) : (
                  <>
                    <Users className="w-3 h-3" />
                    {grupo?.users?.length} miembros
                  </>
                )}
              </p>
            </div>

            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setShowMembers(true)}>
                    <Users className="w-4 h-4 mr-2" />
                    Ver miembros
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowAddMember(true)}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Agregar miembro
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowLeaveDialog(true)}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Salir del grupo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Messages */}
        <GrupoComponent grupoID={groupId} setReplyTo={setReplyTo} initialMessageId={msgId} />

        {/* Input */}
        {/* Input */}
        <ChatInput
          replyTo={replyTo}
          setReplyTo={setReplyTo}
          user={user}
          otherUserName={otherUser?.name}
          newMessage={newMessage}
          onCheckInput={onCheckInput}
          handleKeyPress={handleKeyPress}
          sendMessage={sendMessage}
          setShowEmojiModal={setShowEmojiModal}
          disabled={removed}
        />
      </div>

      <Emojis
        reactToMessage={(_, emoji) => {
          onCheckInput({ target: { value: newMessage + emoji } });
        }}
        selectedMessage={null}
        setSelectedMessage={() => { }}
        showEmojiModal={showEmojiModal}
        setShowEmojiModal={setShowEmojiModal}
      />

      {/*
      <ContactDetailModal
        contact={selectedContact}
        open={isContactModalOpen}
        onOpenChange={setIsContactModalOpen}
      />
      */}

      <GroupMembersSheet
        open={showMembers}
        onOpenChange={setShowMembers}
        memberIds={grupo?.users || []}
        groupName={grupo?.grupo}
      />

      <AddMemberSheet
        grupoID={groupId}
        open={showAddMember}
        onOpenChange={setShowAddMember}
        currentMemberIds={grupo?.users || []}
      />

      <LeaveGroupDialog
        open={showLeaveDialog}
        onOpenChange={setShowLeaveDialog}
        groupName={grupo?.grupo}
        onConfirm={onExitGroup}
      />
    </AppLayout>
  );
};

export default Grupo;
