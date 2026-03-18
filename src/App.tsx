import { ThemeProvider } from "@/context/ThemeProvider";
import { IonApp, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router-dom";

import { lazy, Suspense } from "react";
import Splash from "./pages/Splash/Splash"; // Static for fast initial render

const Canales = lazy(() => import("./pages/Canales/Canales"));
const Grupo = lazy(() => import("./pages/Chat/Grupo/Grupo"));
const Interno = lazy(() => import("./pages/Chat/Interno/Interno"));
const Principal = lazy(() => import("./pages/Comunidades/Principal/Principal"));
const Configuracion = lazy(() => import("./pages/Configuracion/Configuracion"));
const Crecimientos = lazy(() => import("./pages/Crecimientos/Crecimientos"));
const Sharing = lazy(() => import("./pages/Home/Share/Sharing"));
const Login = lazy(() => import("./pages/Login/Login"));
const Clip = lazy(() => import("./pages/Musicaterapia/Clip/Clip"));
const Niveles = lazy(() => import("./pages/Niveles/Niveles"));
const Onboarding = lazy(() => import("./pages/Onboarding/Onboarding"));
const Perfil = lazy(() => import("./pages/Perfil/Perfil"));
const Planes = lazy(() => import("./pages/Planes/Planes"));
const Recordatorios = lazy(() => import("./pages/Recordatorios/Recordatorios"));
const Registro = lazy(() => import("./pages/Registro/Registro"));
const Suscripcion = lazy(() => import("./pages/Suscripcion/Suscripcion"));
const Test = lazy(() => import("./pages/Test/Test"));

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

import { GlobalAudioController } from "@/components/Shared/GlobalAudioController/GlobalAudioController";
import { PageLoader } from "@/components/Shared/PageLoader/PageLoader";
import { Toast } from "@/components/Shared/Toast/Toast";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { selectGlobalAudio } from "@/store/slices/audioSlice";
import { useSelector } from "react-redux";
import { TabsLayout } from "./components/layout/TabsLayout";
import { NetworkProvider } from "./context/NetworkContext";

setupIonicReact({
  innerHTMLTemplatesEnabled: true,
});

const App: React.FC = () => {
  const globalAudio = useSelector(selectGlobalAudio);

  return (
    <IonApp>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <NetworkProvider>
            <FirebaseProvider>
              <IonReactRouter>
                <GlobalAudioController />
                {globalAudio && <Toast />}
                <Suspense fallback={<PageLoader />}>
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
                </Suspense>

              </IonReactRouter>
            </FirebaseProvider>
          </NetworkProvider>
        </TooltipProvider>
      </ThemeProvider>
    </IonApp>
  );
};

export default App;
