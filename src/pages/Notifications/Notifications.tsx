import { AppLayout } from "@/components/layout";
import { Item } from "@/components/Notifications/Item";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { setShowGlobalAudio } from "@/store/slices/audioSlice";
import { setGeneral, update } from "@/store/slices/notificationSlice";
import { Bell, Check } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Notifications = () => {
  const dispatch = useDispatch();
  const { notificaciones } = useSelector((state: any) => state.notifications);

  const { toast } = useToast();

  const markAsRead = (id: string) => {
    const lista = notificaciones.map((n: any) =>
      n.id === id ? { ...n, isRead: true } : n
    );

    dispatch(update({ notificaciones: lista }));
  };

  const markAllAsRead = () => {
    // setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast({ title: "Todas las notificaciones marcadas como leídas" });
  };

  const deleteNotification = (id: string) => {
    // setNotifications(prev => prev.filter(n => n.id !== id));
    const lista = notificaciones.filter((n: any) => n.id !== id);

    dispatch(update({ notificaciones: lista }));

    toast({ title: "Notificación eliminada" });
  };

  const unreadCount = notificaciones.filter((n) => !n.isRead).length;

  useEffect(() => {
    dispatch(setShowGlobalAudio(false));
    dispatch(setGeneral(false));
  }, []);

  return (
    <AppLayout>
      <div className="px-4 py-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Notificaciones
              </h1>
              <p className="text-sm text-muted-foreground">
                {unreadCount} sin leer
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-primary"
            >
              <Check className="w-4 h-4 mr-1" />
              Marcar todas
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notificaciones.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">No tienes notificaciones</p>
            </div>
          ) : (
            notificaciones.map((notification: any, idx: number) => (
              <Item
                key={idx}
                notification={notification}
                markAsRead={markAsRead}
                deleteNotification={deleteNotification}
              />
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Notifications;
