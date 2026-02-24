import Avatar from "@/assets/images/load-avatar.png";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Camera,
  ChevronRight,
  Crown,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

import PerfilComponent from "@/components/Perfil/Perfil";
import { db } from "@/hooks/useDexie";
import { usePayment } from "@/hooks/usePayment";
import { updateData } from "@/services/realtime-db";
import { update } from "@/services/user";
import { setUser } from "@/store/slices/userSlice";
import { useLiveQuery } from "dexie-react-hooks";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

const Perfil: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { user } = useSelector((state: any) => state.user);
  const baseURL = import.meta.env.VITE_BASE_BACK;
  const { userEnabled, payment_status } = usePayment();

  const generos = useLiveQuery(() => db.generos.toArray());

  const fileRef = useRef<any>(null);
  const [photo, setPhoto] = useState("");

  const onClickFile = () => {
    fileRef.current?.click();
  };

  const onUploadImage = (evt: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(evt.target.files[0]);
    reader.onload = function (event: any) {
      setPhoto(event.target.result);
      onUpdateUser(event.target.result);
    };
    reader.onerror = function () {
      // notify(t("profile.alerts.error-image"), "error");
    };
  };

  const onUpdateUser = async (photo: string) => {
    try {
      const { data } = await update({ photo: photo, newPhoto: true }, user.id);

      dispatch(setUser(data.data));

      const obj = {
        name: data.data.name,
        phone: data.data.phone,
        photo: data.data.photo,
        eneatipo: data.data.eneatipo,
        genero: data.data.genero,
      };

      await updateData(`users/${user.id}`, obj);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <AppLayout hideNav>
      <div className="h-full flex flex-col bg-background">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border/50">
          <div className="flex items-center justify-between px-4 py-3">
            <Link to="/home" className="p-2 -ml-2 hover:bg-muted rounded-full">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <h1 className="font-display font-semibold text-lg text-foreground">Mi Perfil</h1>
            <div className="w-9" />
          </div>
        </header>

        <div className="flex-1 overflow-auto">
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

                  <button
                    onClick={onClickFile}
                    className="absolute bottom-0 right-0 w-9 h-9 !rounded-full gradient-primary flex items-center justify-center shadow-lg"
                  >
                    <Camera className="w-4 h-4 text-primary-foreground" />
                  </button>
                </div>

                {/* Name & Subscription */}
                <h2 className="font-display font-bold text-xl !mt-4 !mb-0 text-foreground">
                  {user.name}
                </h2>

                {userEnabled && payment_status != "free" ? (
                  <Link to="/suscripcion">
                    <div className="flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full gradient-premium">
                      <Crown className="w-4 h-4 text-premium-foreground" />
                      <span className="text-sm font-semibold text-premium-foreground">
                        Premium
                      </span>
                    </div>
                  </Link>
                ) : (
                  <div
                    className={`ion-margin-top ion-margin-bottom ion-text-center`}
                  >
                    <Link to="/planes">
                      <Button className="!p-2 green-solid-button !rounded-xl">
                        Unete a {import.meta.env.VITE_NAME} Premium{" "}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="px-4 -mt-4">
              <div className="bg-card rounded-2xl shadow-card px-8 py-6 grid grid-cols-3 gap-4">
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
                  <p className="text-2xl font-bold text-primary">
                    {Math.round(289 / 60)}h
                  </p>
                  <p className="text-xs text-muted-foreground">Escuchadas</p>
                </div>
              </div>
            </div>

            {/* Personal Info Section */}
            <div className="px-4 mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-lg text-foreground">
                  Información personal
                </h3>

                <PerfilComponent />
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
                    <p className="text-xs text-muted-foreground">
                      Fecha de nacimiento
                    </p>
                    <p className="font-medium text-foreground">
                      {new Date(user.fecha_nacimiento).toLocaleDateString(
                        "es-ES",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Género</p>
                    <p className="font-medium text-foreground">
                      {generos?.find((g: any) => g.key === user.genero)?.valor}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enneagram Section */}
            <div className="px-4 mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-lg text-foreground">
                  Tipo de Eneagrama
                </h3>
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
                    <span className="text-2xl font-bold text-premium-foreground">
                      {user.eneatipo}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tu tipo de personalidad
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Perfil;
