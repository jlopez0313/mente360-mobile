import { createRoot } from "react-dom/client";
import App from "./App";
import { IonApp, IonNav, IonRouterOutlet } from "@ionic/react";
import { Provider } from "react-redux";
import { store } from "./store/store";
/* Theme variables */
import "@ionic/react/css/palettes/dark.class.css";
import "./theme/variables.css";
import "./styles.scss";

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
prefersDark.addEventListener("change", (e) => toggleDarkMode(e.matches));

function toggleDarkMode(shouldAdd: boolean) {
  document.documentElement.classList.toggle("ion-palette-dark", shouldAdd);
  document.body.classList.toggle("dark", shouldAdd);
}

toggleDarkMode(localStorage.getItem("darkMode") === "true");

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <IonApp>
    <Provider store={store}>
      <App />
    </Provider>
  </IonApp>
);
