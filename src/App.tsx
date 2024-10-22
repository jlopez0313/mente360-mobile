import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import Home from './pages/Home/Home';
import Crecimiento from './pages/Crecimiento/Crecimiento';
import Login from './pages/Login/Login';
import Configuracion from './pages/Configuracion/Configuración';
import Perfil from './pages/Perfil/Perfil';
import Notifications from './pages/Notifications/Notifications';
import Chat from './pages/Chat/Chat';
import Interno from './pages/Chat/Interno/Interno';
import Musicaterapia from './pages/Musicaterapia/Musicaterapia';
import Test from './pages/Test/Test';
import Registro from './pages/Registro/Registro';
import Grupo from './pages/Chat/Grupo/Grupo';
import Info from './pages/Chat/Grupo/Info/Info';

setupIonicReact({
  innerHTMLTemplatesEnabled: true,
});

const App: React.FC = () => {

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/">
              <Redirect to="/login" />
          </Route>
          
          <Route exact={true} path="/chat" component={Chat} />
          <Route exact={true} path="/chat/:room" component={Interno} />
          
          <Route exact={true} path="/grupo/info/:id" component={Info} />
          <Route exact={true} path="/grupo/:id" component={Grupo} />

          <Route exact={true} path="/configuracion" component={Configuracion} />
          <Route exact={true} path="/crecimiento" component={Crecimiento} />
          <Route exact={true} path="/home" component={Home} />
          <Route exact={true} path="/login" component={Login} />
          <Route exact={true} path="/registro" component={Registro} />
          <Route exact={true} path="/musicaterapia" component={Musicaterapia} />
          <Route exact={true} path="/notificaciones" component={Notifications} />
          <Route exact={true} path="/perfil" component={Perfil} />
          <Route exact={true} path="/test" component={Test} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );

}

export default App;
