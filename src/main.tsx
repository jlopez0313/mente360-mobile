import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { IonNav } from '@ionic/react';
import { UIProvider } from './context/Context';
import { Provider } from 'react-redux';
import { store } from './store/store';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <Provider store={store}>
    <UIProvider>
      <IonNav root={() => <App />}></IonNav>
    </UIProvider>
  </Provider>
);