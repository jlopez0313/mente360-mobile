import Avatar from "@/assets/images/load-avatar.png";
import { useRef, useState } from "react";
import { AppLayout } from "@/components/layout";
import { mockUser, enneagramTypes, genderOptions, mockReminders } from "@/lib/mockData";
import {
  ArrowLeft,
  Camera,
  User,
  Mail,
  Phone,
  Calendar,
  Crown,
  Edit2,
  Bell,
  Plus,
  Trash2,
  ChevronRight,
  TestTubes
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { usePayment } from "@/hooks/usePayment";
import styles from "./Perfil.module.scss";
import { updateData } from "@/services/realtime-db";
import { useIonAlert, useIonLoading } from "@ionic/react";
import { update } from "@/services/user";
import { setUser } from "@/store/slices/userSlice";

import { toastController } from "@ionic/core";
const weekDayLabels = ["D", "L", "M", "M", "J", "V", "S"];

const Perfil: React.FC = () => {
  const history = useHistory();

  const { user } = useSelector((state: any) => state.user);
  const baseURL = import.meta.env.VITE_BASE_BACK;
  const { userEnabled, payment_status } = usePayment();
  const [user2, setUser] = useState(mockUser);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    fecha_nacimiento: user.fecha_nacimiento,
    gender: user.gender,
    enneagramType: user.enneagramType,
  });

  const handleSaveProfile = () => {
    setUser({ ...user, ...editForm });
    onUpdateUser();
    setEditProfileOpen(false);
    toast.success("Perfil actualizado");
  };

  const getEnneagramLabel = (type: number) => {
    return enneagramTypes.find(e => e.value === type)?.label || "";
  };

  const onSetUser = (idx: string, value: any) => {
    usuario[idx] = value;
    setUsuario({ ...usuario });
  };


  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [usuario, setUsuario] = useState({ ...user });

  const [edad, setEdad] = useState(0);
  const [photo, setPhoto] = useState("");

    const [presentAlert] = useIonAlert();
    
      const [present, dismiss] = useIonLoading();
      
  const goToSuscripcion = async () => {
    history.replace('/suscripcion');
  }

  const goToPlanes = async () => {
    history.replace('/planes');
  }

  const getFechaVencimiento = () => {
    return new Date(user.fecha_vencimiento).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replaceAll('/', '-')
  }

  const onClickFile = () => {
    fileRef.current?.click();
  };

  
  const onUploadImage = (evt: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(evt.target.files[0]);
    reader.onload = function (event: any) {
      onSetUser("photo", event.target.result);
      onSetUser("newPhoto", true);
      setPhoto(event.target.result);
    };
    reader.onerror = function () {
      // notify(t("profile.alerts.error-image"), "error");
    };
  };

   const onUpdateUser = async () => {
      try {
        present({
          message: "Cargando ...",
        });
  
        const { data } = await update(usuario, user.id);
  
        dispatch(setUser(data.data));
        setUsuario({ ...data.data });
  
        const obj = {
          name: data.data.name,
          phone: data.data.phone,
          photo: data.data.photo,
          edad: edad,
          eneatipo: usuario.eneatipo,
          genero: usuario.genero,
        };
  
        await updateData(`users/${user.id}`, obj);
  
        const toast = await toastController.create({
          message: "Perfil Actualizado!",
          duration: 1000
        });
  
        toast.present();
  
      } catch (error: any) {
        console.log(error);
  
        presentAlert({
          header: "Alerta!",
          subHeader: "Mensaje importante.",
          message: error.data?.message || "Error Interno",
          buttons: ["OK"],
        });
      } finally {
        dismiss();
      }
    };

  return (
    <AppLayout hideNav>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border/50">
          <div className="flex items-center justify-between px-4 py-3">
            <Link to="/" className="p-2 -ml-2 hover:bg-muted rounded-full">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <h1 className="font-display font-semibold text-lg">Mi Perfil</h1>
            <div className="w-9" />
          </div>
        </header>

          <div className="flex justify-center">
       
          <input
            type="file"
            className="ion-hide"
            ref={fileRef}
            onChange={onUploadImage}
            accept="image/png, image/jpeg"
          />
         
            <img
              src={photo}
               onClick={onClickFile}
             
            />
          

      </div>

        <div className="pb-8">
          {/* Profile Header */}
          <div className="relative bg-gradient-to-b from-primary/20 to-background pt-8 pb-16">
            <div className="flex flex-col items-center">
              {/* Avatar */}
              <div className="relative">
                <img
                 onClick={onClickFile}
                  src={user.photo ? baseURL + user.photo : Avatar}
                  alt={user.name}
                  className="w-28 h-28 rounded-full object-cover border-4 border-background shadow-elevated"
                />

 <input
            type="file"
            className="ion-hide"
            ref={fileRef}
            onChange={onUploadImage}
            accept="image/png, image/jpeg"
          />

                <button onClick={onUploadImage} className="absolute bottom-0 right-0 w-9 h-9 rounded-full gradient-primary flex items-center justify-center shadow-lg">
                  <Camera className="w-4 h-4 text-primary-foreground" />
                </button>


              </div>

              {/* Name & Subscription */}
              <h2 className="font-display font-bold text-xl mt-4 text-foreground">
                {user.name}
              </h2>

              {userEnabled && payment_status != 'free' ? (
                <div >
                  <div className="flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full gradient-premium">
                    <Crown className="w-4 h-4 text-premium-foreground" />
                    <span className="text-sm font-semibold text-premium-foreground">
                      Premium
                    </span>
                  </div>

                </div>

              ) : (<div className={`ion-margin-top ion-margin-bottom ion-text-center`}>
                <Button  style={{ padding: '20px'}} className="green-solid-button" onClick={goToPlanes}>Unete a {import.meta.env.VITE_NAME} PREMIUM </Button>
              </div>)
              }


              {userEnabled && payment_status != 'free' ? (
                <div
                  className={`ion-margin-top ion-margin-bottom ion-text-center ${styles['premium']}`}
                  onClick={goToSuscripcion}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline' }}>
                    <span>Vence el: {getFechaVencimiento()}</span>
                  </div>
                  <div>
                    <span className={`${styles["detalle"]}`}>Ver Detalles</span>
                  </div>
                </div>
              ) : <div > </div >
              }



            </div>
          </div>

          {/* Stats */}
          <div className="px-4 -mt-8">
            <div className="bg-card rounded-2xl shadow-card p-8 grid grid-cols-3 gap-4">
              <div className="text-center">
                {/*user.stats.daysActive*/}
                <p className="text-2xl font-bold text-primary">{45}</p>
                <p className="text-xs text-muted-foreground">Días activo</p>
              </div>
              <div className="text-center border-x border-border">
                {/*user.stats.tasksCompleted*/}
                <p className="text-2xl font-bold text-primary">{5}</p>
                <p className="text-xs text-muted-foreground">Tareas</p>
              </div>
              <div className="text-center">
                {/**user.stats.minutesListened  */}
                <p className="text-2xl font-bold text-primary">{Math.round(289 / 60)}h</p>
                <p className="text-xs text-muted-foreground">Escuchadas</p>
              </div>
            </div>
          </div>

          {/* Personal Info Section */}
          <div className="px-4 mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-lg">Información personal</h3>
              <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-primary">
                    <Edit2 className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm mx-auto rounded-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Editar perfil</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4 ">
                    <div>
                      <Label className="text-foreground">Nombre completo</Label>
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label className="text-foreground">Email</Label>
                      <Input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label className="text-foreground">Teléfono</Label>
                      <Input
                        value={editForm.phone}
                        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label className="text-foreground">Fecha de nacimiento</Label>
                      <Input
                        type="date"
                        value={editForm.fecha_nacimiento}
                        onChange={(e) => setEditForm(prev => ({ ...prev, fecha_nacimiento: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label className="text-foreground">Género</Label>
                      <Select
                        value={editForm.gender}
                        onValueChange={(v) => setEditForm(prev => ({ ...prev, gender: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {genderOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-foreground">Tipo de Eneagrama</Label>
                      <Select
                        value={String(editForm.enneagramType)}
                        onValueChange={(v) => setEditForm(prev => ({ ...prev, enneagramType: parseInt(v) }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {enneagramTypes.map(type => (
                            <SelectItem key={type.value} value={String(type.value)}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleSaveProfile} className="w-full gradient-primary text-primary-foreground">
                      Guardar cambios
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-card rounded-2xl shadow-card divide-y divide-border">
              <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Nombre</p>
                  <p className="font-medium text-foreground">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Teléfono</p>
                  <p className="font-medium text-foreground">{user.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Fecha de nacimiento</p>
                  <p className="font-medium text-foreground">
                    {new Date(user.fecha_nacimiento).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enneagram Section */}
          <div className="px-4 mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-lg">Tipo de Eneagrama</h3>
              <button
                onClick={() => history.replace("/test")}
                className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
              >
                Hacer test
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-gradient-to-r from-premium/10 to-premium/5 rounded-2xl p-4 border border-premium/20">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full gradient-premium flex items-center justify-center">
                  <span className="text-2xl font-bold text-premium-foreground">{user.eneatipo}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{getEnneagramLabel(user.enneagramType)}</p>
                  <p className="text-sm text-muted-foreground">Tu tipo de personalidad</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}

export default Perfil;