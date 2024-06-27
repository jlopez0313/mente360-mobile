import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { IonNav } from '@ionic/react';
import { UIProvider } from './context/Context';


const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <UIProvider>
    <IonNav root={() => <App />}></IonNav>
  </UIProvider>
);