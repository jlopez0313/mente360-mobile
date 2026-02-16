import { AppLayout } from "@/components/layout";
import { ArrowLeft, Moon, Sun, Bell, LogOut, ChevronRight, ExternalLink, FileText, Shield, HelpCircle, Mail, Users, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
//import { useAuth } from "@/contexts/AuthContext";

import { usePreferences } from "@/hooks/usePreferences";
import { useHistory } from "react-router";

const Configuracion: React.FC = () => {
  const history = useHistory();
  
  const { toast } = useToast();
  //const { logout } = useAuth();
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });
  
  const [pushNotifications, setPushNotifications] = useState(() => {
    const saved = localStorage.getItem("pushNotifications");
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("pushNotifications", JSON.stringify(pushNotifications));
  }, [pushNotifications]);

  const { removePreference, keys } = usePreferences();
  
  const handleLogout = async () => {
    localStorage.removeItem("home");
    localStorage.removeItem("onboarding");

    await removePreference(keys.TOKEN);
    await removePreference(keys.HOME_SYNC_KEY);

    history.replace("/login",{replace: true});
  
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente",
    });
  };

  return (
    <AppLayout>
      <div className="px-4 py-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => history.go(-1)}
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Configuración</h1>
        </div>


        <div className="space-y-6">

          {/* Profile Section */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-4 py-3 bg-muted/50">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Perfil
              </h2>
            </div>
            
            <div className="divide-y divide-border">
              <a 
                href="/perfil" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Editar perfil</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </a>
              
              <a 
                href="/recordatorios" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Mis recordatorios</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </a>
              
              <a 
                href="/test" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Realizar test eneagrama</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </a>
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
                    {isDarkMode ? (
                      <Moon className="w-5 h-5 text-night" />
                    ) : (
                      <Sun className="w-5 h-5 text-morning" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Tema oscuro</p>
                    <p className="text-sm text-muted-foreground">
                      {isDarkMode ? "Activado" : "Desactivado"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
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
                    <p className="font-medium text-foreground">Notificaciones push</p>
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
              <a 
                href="https://mente360.com/nosotros" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Sobre nosotros</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </a>
              
              <a 
                href="https://mente360.com/terminos" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Términos y condiciones</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </a>
              
              <a 
                href="https://mente360.com/privacidad" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Política de privacidad</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </a>
              
              <a 
                href="https://mente360.com/soporte" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Soporte</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </a>
              
              <a 
                href="mailto:hola@mente360.com" 
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Escríbenos</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </a>
            </div>
          
          </div>

          {/* Account Section */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-4 py-3 bg-muted/50">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Cuenta
              </h2>
            </div>
            
            <div className="p-4">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-between text-sos hover:text-sos hover:bg-sos/10"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5" />
                  <span>Cerrar sesión</span>
                </div>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}


export default Configuracion;