import { ThemeProvider } from "@/context/ThemeProvider";
import { IonApp, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router-dom";

import Canales from "./pages/Canales/Canales";
import Grupo from "./pages/Chat/Grupo/Grupo";
import Interno from "./pages/Chat/Interno/Interno";
import Principal from "./pages/Comunidades/Principal/Principal";
import Configuracion from "./pages/Configuracion/Configuracion";
import Crecimientos from "./pages/Crecimientos/Crecimientos";
import Sharing from "./pages/Home/Share/Sharing";
import Login from "./pages/Login/Login";
import Clip from "./pages/Musicaterapia/Clip/Clip";
import Niveles from "./pages/Niveles/Niveles";
import Onboarding from "./pages/Onboarding/Onboarding";
import Perfil from "./pages/Perfil/Perfil";
import Planes from "./pages/Planes/Planes";
import Recordatorios from "./pages/Recordatorios/Recordatorios";
import Registro from "./pages/Registro/Registro";
import Splash from "./pages/Splash/Splash";
import Suscripcion from "./pages/Suscripcion/Suscripcion";
import Test from "./pages/Test/Test";

import { FirebaseProvider } from "./context/FirebaseContext";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";

import { Toast } from "@/components/Shared/Toast/Toast";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useSelector } from "react-redux";
import { TabsLayout } from "./components/layout/TabsLayout";
import { NetworkProvider } from "./context/NetworkContext";

setupIonicReact({
  innerHTMLTemplatesEnabled: true,
});

const App: React.FC = () => {
  const { globalAudio, showGlobalAudio } = useSelector(
    (state: any) => state.audio
  );



  return (
    <IonApp>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <NetworkProvider>
            <FirebaseProvider>
              <IonReactRouter>
                {globalAudio && showGlobalAudio && <Toast />}
                <Route exact path="/">
                  <Splash />
                </Route>

                {/* Tabs */}
                <Route
                  exact
                  path={[
                    "/home",
                    "/comunidades",
                    "/notificaciones",
                    "/musicaterapia",
                    "/chat",
                  ]}
                >
                  <TabsLayout />
                </Route>

                <Route exact path="/seleccionar-comunidad">
                  <Principal />
                </Route>

                <Route exact path="/onboarding">
                  <Onboarding />
                </Route>

                <Route exact path="/planes">
                  <Planes />
                </Route>

                <Route exact path="/chat/:room">
                  <Interno />
                </Route>

                <Route exact path="/grupo/:id">
                  <Grupo />
                </Route>

                <Route exact path="/comunidades/:id/canales">
                  <Canales />
                </Route>

                <Route exact path="/canales/:id/niveles">
                  <Niveles />
                </Route>

                <Route exact path="/niveles/:id/crecimientos">
                  <Crecimientos />
                </Route>

                <Route exact path="/share">
                  <Sharing />{" "}
                </Route>

                <Route exact path="/login">
                  <Login />{" "}
                </Route>

                <Route exact path="/registro">
                  <Registro />{" "}
                </Route>

                <Route exact path="/suscripcion">
                  <Suscripcion />{" "}
                </Route>

                <Route exact path="/musicaterapia/clip">
                  <Clip />{" "}
                </Route>

                <Route exact path="/perfil">
                  <Perfil />{" "}
                </Route>

                <Route exact path="/configuracion">
                  {" "}
                  <Configuracion />
                </Route>

                <Route exact path="/test">
                  {" "}
                  <Test />{" "}
                </Route>

                <Route exact path="/recordatorios">
                  <Recordatorios />
                </Route>

              </IonReactRouter>
            </FirebaseProvider>
          </NetworkProvider>
        </TooltipProvider>
      </ThemeProvider>
    </IonApp>
  );
};

export default App;
