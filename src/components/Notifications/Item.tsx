import Logo from "@/assets/images/logo.png";
import { NetworkContext } from "@/context/NetworkContext";
import { formatDate } from "@/helpers/Fechas";
import { cn } from "@/lib/utils";
import { Check, Trash2 } from "lucide-react";
import { useContext } from "react";
import { Button } from "../ui/button";

type Props = {
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  notification: any;
}

export const Item = ({ markAsRead, deleteNotification, notification }: Props) => {
  
  const baseURL = import.meta.env.VITE_BASE_BACK;
  const { status, connectionType } = useContext(NetworkContext);

  return (
    <div
      key={notification.id}
      className={cn(
        "p-4 rounded-xl border transition-all",
        notification.isRead
          ? "bg-card border-border"
          : "bg-primary/5 border-primary/20"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-full mt-2 flex-shrink-0",
          )}
        >
          <img alt="" src={
            status ? 
              notification.comunidad ? 
              baseURL + notification.comunidad?.imagen
              : Logo
            : Logo} />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-sm",
              notification.isRead ? "text-muted-foreground" : "text-foreground"
            )}
          >
            {notification.notificacion}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDate(notification.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {!notification.isRead && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => markAsRead(notification.id)}
            >
              <Check className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => deleteNotification(notification.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
