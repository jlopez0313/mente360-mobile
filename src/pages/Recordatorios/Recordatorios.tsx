


import { AppLayout } from "@/components/layout";
import { enneagramTypes, mockUser } from "@/lib/mockData";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { all, create, remove, toggle } from "@/services/alarmas";
import { useIonLoading } from "@ionic/react";
import {
  ArrowLeft,
  Bell,
  Plus,
  Trash2
} from "lucide-react";
import { Link, useHistory } from "react-router-dom";
import { toast } from "sonner";

const weekDayLabels = ["D", "L", "M", "M", "J", "V", "S"];

export default function Recordatorios() {
  //const navigate = useNavigate();

  const history = useHistory();
  const [present, onDismiss] = useIonLoading();
  
  const [reminders, setReminders] = useState<any[]>([]);

  const [user, setUser] = useState(mockUser);
  //const [reminders, setReminders] = useState(mockReminders);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [addReminderOpen, setAddReminderOpen] = useState(false);
  

   const getNotifications = async () => {
      try {
        present({
          message: "Cargando ...",
        });
  
        const { data: { data } } = await all();
        setReminders(data);
  
      } catch (error) {
        console.error(error);
      } finally {
        onDismiss();
      }
    };

  
    useEffect(() => {
      getNotifications();
    }, []);
    
  // New reminder form state
  const [newReminder, setNewReminder] = useState({
    title: "",
    time: "08:00",
    dias_semana: [1, 2, 3, 4, 5] as number[],
  });

 const toggleReminderActive2 = (reminderId: string) => {
  setReminders(prev =>
    prev.map(reminder =>
      reminder.id === reminderId
        ? { ...reminder, active: !reminder.active }
        : reminder
    )
  );
};

const toggleReminderActive = async (reminderId: string) => {
  const reminder = reminders.find(r => r.id === reminderId);
  if (!reminder) return;

  const newState = !reminder.active;

  setReminders(prev =>
    prev.map(r =>
      r.id === reminderId
        ? { ...r, active: newState }
        : r
    )
  );

  try {
    await toggle(reminderId, { active: newState });
  } catch (error) {
    console.error(error);

    setReminders(prev =>
      prev.map(r =>
        r.id === reminderId
          ? { ...r, active: reminder.active }
          : r
      )
    );

    console.log("ERROR COMPLETO:", error);

    toast.error("No se pudo actualizar el recordatorio");
  }
};




 const deleteReminder = async (reminderId: string) => {
  try {
    await remove(reminderId);

    setReminders(prev => prev.filter(r => r.id !== reminderId));

    toast.success("Recordatorio eliminado");
  } catch (error) {
    console.error(error);
    toast.error("No se pudo eliminar");
  }
};


const addReminder = async () => {
  if (!newReminder.title) {
    toast.error("Ingresa un nombre para el recordatorio");
    return;
  }

  try {
    present({ message: "Guardando..." });

    const [hora, mins] = newReminder.time.split(":");

    const dataNotification = {
      title: newReminder.title,
      days: newReminder.dias_semana,
      hora,
      min: mins,
    };

    await create(dataNotification);

    await getNotifications();

    setNewReminder({ title: "", time: "08:00", dias_semana: [1,2,3,4,5] });
    setAddReminderOpen(false);

    toast.success("Recordatorio agregado");

  } catch (error) {
    console.error(error);
    toast.error("Error al guardar");
  } finally {
    onDismiss();
  }
};
 

  const toggleReminderDay = (day: number) => {
    setNewReminder(prev => ({
      ...prev,
      dias_semana: prev.dias_semana.includes(day) 
        ? prev.dias_semana.filter(d => d !== day)
        : [...prev.dias_semana, day].sort(),
    }));
  };

  const getEnneagramLabel = (type: number) => {
    return enneagramTypes.find(e => e.value === type)?.label || "";
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-background">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border/50">
          <div className="flex items-center justify-between px-4 py-3">
            <Link to="/" className="p-2 -ml-2 hover:bg-muted rounded-full">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <h1 className="font-display font-semibold text-lg">Mis Recordatorios</h1>
            <Dialog open={addReminderOpen} onOpenChange={setAddReminderOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-primary">
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm mx-auto rounded-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Nuevo recordatorio</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label className="text-foreground">Nombre</Label>
                      <Input 
                        placeholder="Ej: Meditación matutina"
                        value={newReminder.title}
                        onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label className="text-foreground">Hora</Label>
                      <Input className="text-foreground"
                        type="time"
                        value={newReminder.time}
                        onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label className="text-foreground">Días</Label>
                      <div className="flex gap-2 mt-2">
                        {weekDayLabels.map((day, index) => (
                          <button
                            key={index}
                            onClick={() => toggleReminderDay(index)}
                            className={cn(
                              "w-9 h-9 !rounded-full text-sm font-semibold transition-all",
                              newReminder.dias_semana.includes(index)
                                ? "gradient-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Button onClick={addReminder} className="w-full gradient-primary text-primary-foreground">
                      Crear recordatorio
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pb-8">
          
          {/* Reminders Section */}
          <div className="px-4 mt-6">
            
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <div 
                  key={reminder.id}
                  className="bg-card rounded-2xl shadow-card p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        reminder.active ? "gradient-primary" : "bg-muted"
                      )}>
                        <Bell className={cn(
                          "w-5 h-5",
                          reminder.active ? "text-primary-foreground" : "text-muted-foreground"
                        )} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{reminder.title}</p>
                        <p className="text-2xl font-bold text-primary">{reminder.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={reminder.active}
                        onCheckedChange={() => toggleReminderActive(reminder.id)}
                      />
                      <button 
                        onClick={() => deleteReminder(reminder.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  

                  {/* Days */}
                  <div className="flex gap-1.5">
                    {weekDayLabels.map((day, index) => (
                      <span
                        key={index}
                        className={cn(
                          "w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center",
                          reminder.dias_semana.includes(index)
                            ? reminder.active 
                              ? "bg-primary/20 text-primary" 
                              : "bg-muted text-muted-foreground"
                            : "bg-transparent text-muted-foreground/50"
                        )}
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              ))}              
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}


