import { MusicPreferencesModal } from "@/components/GuidedDay/MusicPreferencesModal";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/hooks/useDexie";
import { useMusicPreferences } from "@/hooks/useMusicPreferences";
import { resetOnboardingTips } from "@/hooks/useOnboardingTips";
import { usePreferences } from "@/hooks/usePreferences";
import { Browser } from "@capacitor/browser";
import { useLiveQuery } from "dexie-react-hooks";
import * as LucideIcons from "lucide-react";
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  CreditCard,
  ExternalLink,
  FileText,
  HelpCircle,
  LogOut,
  Moon,
  Music,
  Shield,
  Sun,
  Trash2,
  Users
} from "lucide-react";
import DeleteAccountDialog from "./DeleteAccountDialog";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

const Configuracion: React.FC = () => {
  const history = useHistory();
  const { theme, setTheme } = useTheme();

  const { toast } = useToast();

  const enlaces = useLiveQuery(async () => {
    return await db.enlaces.toArray();
  }, []);

  const [pushNotifications, setPushNotifications] = useState(() => {
    const saved = localStorage.getItem("pushNotifications");
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem(
      "pushNotifications",
      JSON.stringify(pushNotifications)
    );
  }, [pushNotifications]);

  const { removePreference, keys } = usePreferences();

  const { preferences, savePreferences } = useMusicPreferences();
  const [showMusicPrefs, setShowMusicPrefs] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  const clearSession = async () => {
    localStorage.removeItem("home");
    localStorage.removeItem("onboarding");

    await removePreference(keys.TOKEN);
    await removePreference(keys.HOME_SYNC_KEY);

    history.replace("/login", { replace: true });
  };

  const handleLogout = async () => {
    await clearSession();

    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente",
    });
  };

  const handleAccountDeleted = async () => {
    setShowDeleteAccount(false);
    await clearSession();

    toast({
      title: "Cuenta eliminada",
      description: "Tu cuenta y tu información han sido eliminadas",
    });
  };

  // Reaparecen las tarjetas de "primeros pasos" (Home) y los tips contextuales
  // de cada sección, por si se descartaron sin querer o simplemente se quieren
  // repasar. Ver src/hooks/useOnboardingTips.ts.
  const handleResetTips = async () => {
    await resetOnboardingTips();

    toast({
      title: "Guías reiniciadas",
      description: "Volverán a aparecer al entrar a cada sección",
    });
  };

  return (
    <AppLayout hideNav>
      <div className="min-h-full flex flex-col bg-background">
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3.5 safe-top">
          <div className="flex items-center gap-2">
            <button
              onClick={() => history.replace('/home')}
              className="w-9 h-9 -ml-1.5 shrink-0 rounded-full flex items-center justify-center text-foreground hover:bg-muted active:scale-95 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Configuración</h1>
          </div>
        </header>

        <div className="flex-1 px-4 py-4 space-y-6">
          {/* Profile Section */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-4 py-3 bg-muted/50">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Perfil
              </h2>
            </div>

            <div className="divide-y divide-border">
              <Link
                to="/perfil"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Editar perfil</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Link>

              <Link
                to="/recordatorios"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Mis recordatorios</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Link>

              <Link
                to="/test"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-foreground">
                    Realizar test eneagrama
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Link>

              <div
                role="button"
                tabIndex={0}
                onClick={() => setShowMusicPrefs(true)}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Music className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Preferencias de música</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>

              <div
                role="button"
                tabIndex={0}
                onClick={handleResetTips}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Reiniciar guías de la app</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-4 py-3 bg-muted/50">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Apariencia
              </h2>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-night/10 flex items-center justify-center">
                    {theme == "dark" ? (
                      <Moon className="w-5 h-5 text-night" />
                    ) : (
                      <Sun className="w-5 h-5 text-morning" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Tema oscuro</p>
                    <p className="text-sm text-muted-foreground">
                      {theme == "dark" ? "Activado" : "Desactivado"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={theme == "dark"}
                  onCheckedChange={() =>
                    setTheme(theme === "dark" ? "light" : "dark")
                  }
                />
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-4 py-3 bg-muted/50">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Notificaciones
              </h2>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Notificaciones push
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Recibe recordatorios y actualizaciones
                    </p>
                  </div>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
            </div>
          </div>

          {/* Subscription Section */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-4 py-3 bg-muted/50">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Suscripción
              </h2>
            </div>

            <div className="p-4">
              <Link to="/planes">
                <Button
                  variant="ghost"
                  className="w-full justify-between text-foreground hover:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <span>Ver planes</span>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Community Section */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-4 py-3 bg-muted/50">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Comunidad
              </h2>
            </div>

            <div className="p-4">
              <Link to="/seleccionar-comunidad">
                <Button
                  variant="ghost"
                  className="w-full justify-between text-foreground hover:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary" />
                    <span>Comunidad principal</span>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Links Section */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-4 py-3 bg-muted/50">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Información
              </h2>
            </div>

            <div className="divide-y divide-border">
              {enlaces?.map((enlace) => {
                const Icon =
                  (LucideIcons as any)[enlace.icon] || LucideIcons.Link;
                return (
                  <div
                    key={enlace.key}
                    onClick={async (e) => {
                      e.preventDefault();
                      if (enlace.action === "copyLink") {
                        try {
                          await navigator.clipboard.writeText(enlace.link);
                          toast({
                            title: "Link copiado",
                            description:
                              "El link se ha copiado al portapapeles",
                          });
                        } catch (err) {
                          console.error("Error al copiar link:", err);
                        }
                      } else {
                        await Browser.open({ url: enlace.link });
                      }
                    }}
                    className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-primary" />
                      <span className="text-foreground">{enlace.valor}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Account Section */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-4 py-3 bg-muted/50">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Cuenta
              </h2>
            </div>

            <div className="divide-y divide-border">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-between text-sos hover:text-sos hover:bg-sos/10 !rounded-none"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5" />
                  <span>Cerrar sesión</span>
                </div>
                <ChevronRight className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                onClick={() => setShowDeleteAccount(true)}
                className="w-full justify-between text-destructive hover:text-destructive hover:bg-destructive/10 !rounded-none"
              >
                <div className="flex items-center gap-3">
                  <Trash2 className="w-5 h-5" />
                  <span>Eliminar cuenta</span>
                </div>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              Versión {import.meta.env.VITE_VERSION}
            </p>
          </div>
        </div>
      </div>

      <MusicPreferencesModal
        isOpen={showMusicPrefs}
        initialPreferences={preferences}
        onClose={() => setShowMusicPrefs(false)}
        onSave={(genres) => {
          savePreferences(genres);
          setShowMusicPrefs(false);
          toast({
            title: "Preferencias guardadas",
            description: "Actualizamos tus géneros de música.",
          });
        }}
      />

      <DeleteAccountDialog
        open={showDeleteAccount}
        onOpenChange={setShowDeleteAccount}
        onDeleted={handleAccountDeleted}
      />
    </AppLayout>
  );
};

export default Configuracion;
