import { AppLayout } from "@/components/layout";
import { Item } from "@/components/Notifications/Item";
import { TipCard } from "@/components/Shared/Onboarding/TipCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/hooks/useDexie";
import { setShowGlobalAudio } from "@/store/slices/audioSlice";
import { setGeneral } from "@/store/slices/notificationSlice"; // Eliminamos update import
import { useLiveQuery } from "dexie-react-hooks";
import { Bell, Check } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Notifications = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state: any) => state.user);

  // Escuchamos la base de datos local y omitimos las eliminadas
  const notificaciones = useLiveQuery(async () => {
    const list = await db.notificaciones
      .where({ user_id: user.id })
      .filter((n: any) => !n.isDeleted).toArray();
    // Ordenar de más reciente a más antigua
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, []) || [];

  const markAsRead = async (id: string) => {
    await db.notificaciones.update(id, { isRead: true });
  };

  const markAllAsRead = async () => {
    const unreadIds = notificaciones
      .filter((n: any) => !n.isRead)
      .map((n: any) => n.id);

    if (unreadIds.length > 0) {
      await Promise.all(
        unreadIds.map(id => db.notificaciones.update(id, { isRead: true }))
      );
      toast({ title: "Todas las notificaciones marcadas como leídas" });
    }
  };

  const deleteNotification = async (id: string) => {
    await db.notificaciones.update(id, { isDeleted: true });
    toast({ title: "Notificación eliminada" });
  };

  const unreadCount = notificaciones.filter((n: any) => !n.isRead).length;

  useEffect(() => {
    dispatch(setShowGlobalAudio(false));
    dispatch(setGeneral(false));
  }, []);

  return (
    <AppLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 safe-top px-4 py-4 space-y-4">
          <div className="flex items-center justify-between mb-1">
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
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto space-y-3 px-4 py-6">
          <TipCard tipKey="notificaciones" />

          {notificaciones.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">No tienes notificaciones</p>
            </div>
          ) : (
            notificaciones.map((notification: any, idx: number) => (
              <Item
                key={notification.id || idx}
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
