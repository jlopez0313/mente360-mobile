import { IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";

import Chat from "./pages/Chat/Chat";
import Grupo from "./pages/Chat/Grupo/Grupo";
import Info from "./pages/Chat/Grupo/Info/Info";
import Interno from "./pages/Chat/Interno/Interno";
import Configuracion from "./pages/Configuracion/Configuración";
import Crecimiento from "./pages/Crecimiento/Crecimiento";
import Home from "./pages/Home/Home";
import Sharing from "./pages/Home/Share/Sharing";
import Login from "./pages/Login/Login";
import Clip from "./pages/Musicaterapia/Clip/Clip";
import Musicaterapia from "./pages/Musicaterapia/Musicaterapia";
import Notifications from "./pages/Notifications/Notifications";
import Perfil from "./pages/Perfil/Perfil";
import Add from "./pages/Recordatorios/Add/Add";
import Recordatorios from "./pages/Recordatorios/Recordatorios";
import Registro from "./pages/Registro/Registro";
import Reset from "./pages/Reset/Reset";
import Test from "./pages/Test/Test";


import { DBProvider } from "./context/Context";

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

/* Theme variables */
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Toast } from "./components/Toast/Toast";
import "./theme/variables.css";

setupIonicReact({
  innerHTMLTemplatesEnabled: true,
});

const App: React.FC = () => {

  const { globalAudio, showGlobalAudio } = useSelector(
    (state: any) => state.audio
  );

  const checkForUpdates = async () => {
    try {
      const updateAvailable = await CapacitorUpdater.isAutoUpdateAvailable();

      if (updateAvailable) {
        console.log('Actualización automática disponible');

        // Escucha cuando la app está lista después de la actualización
        CapacitorUpdater.addListener('appReady', () => {
          console.log('La aplicación se actualizó y está lista');
          CapacitorUpdater.reload();
        });

        console.log('Esperando la aplicación actualizada...');
      } else {
        console.log('No hay actualizaciones automáticas disponibles');
      }
    } catch (error) {
      console.error('Error verificando actualizaciones:', error);
    }
  };
  
  useEffect(() => {
    checkForUpdates();
  }, []);

  return (
    <>
      <IonReactRouter>
        
        {globalAudio && showGlobalAudio && <Toast />}

        <DBProvider>
          <IonRouterOutlet>
            <Route exact path="/" render={() => <Redirect to="/login" />} />

            <Route exact={true} path="/chat" component={Chat} />
            <Route exact={true} path="/chat/:room" component={Interno} />

            <Route exact={true} path="/grupo/info/:id" component={Info} />
            <Route exact={true} path="/grupo/:id" component={Grupo} />

            <Route exact={true} path="/home" component={Home} />
            <Route exact={true} path="/share" component={Sharing} />
            

            <Route exact={true} path="/crecimiento" component={Crecimiento} />
            <Route exact={true} path="/configuracion" component={Configuracion} />

            <Route exact={true} path="/login" component={Login} />
            <Route exact={true} path="/reset" component={Reset} />
            <Route exact={true} path="/registro" component={Registro} />

            <Route exact={true} path="/musicaterapia" component={Musicaterapia} />
            <Route exact={true} path="/musicaterapia/clip" component={Clip} />

            <Route
              exact={true}
              path="/notificaciones"
              component={Notifications}
            />

            <Route exact={true} path="/perfil" component={Perfil} />
            <Route exact={true} path="/test" component={Test} />
            <Route exact={true} path="/recordatorios" component={Recordatorios} />
            <Route exact={true} path="/recordatorios/Add" component={Add} />

          </IonRouterOutlet>
        </DBProvider>
      </IonReactRouter>
    </>

  );
};

export default App;
