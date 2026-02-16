import { IonApp } from "@ionic/react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./store/store";
/* Theme variables */
import "./main.css";
import "./styles.scss";


const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
prefersDark.addEventListener("change", (e) => toggleDarkMode());

function toggleDarkMode() {
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  localStorage.setItem("darkMode", systemPrefersDark.toString());

  document.documentElement.classList.toggle(
    "ion-palette-dark",
    systemPrefersDark
  );
  document.body.classList.toggle("dark", systemPrefersDark);
}

toggleDarkMode();

window.addEventListener("DOMContentLoaded", async () => {
  try {
    
    const container = document.getElementById("root");
    const root = createRoot(container!);
    root.render(
      <IonApp>
        <Provider store={store}>
          <App />
        </Provider>
      </IonApp>
    );
  } catch (e) {
    console.log(e);
  }
});
