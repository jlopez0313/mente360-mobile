import { createRoot } from "react-dom/client";
import App from "./App";
import { IonApp, IonNav, IonRouterOutlet } from "@ionic/react";
import { Provider } from "react-redux";
import { store } from "./store/store";
/* Theme variables */
import "@ionic/react/css/palettes/dark.class.css";
import "./theme/variables.css";
import "./styles.scss";

import { JeepSqlite } from "jeep-sqlite/dist/components/jeep-sqlite";
import { CapacitorSQLite, SQLiteConnection } from "@capacitor-community/sqlite";
import { Capacitor } from "@capacitor/core";

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
    const platform = Capacitor.getPlatform();

    if (platform === "web") {
      const sqlite = new SQLiteConnection(CapacitorSQLite);

      customElements.define("jeep-sqlite", JeepSqlite);
      const jeepSqliteEl = document.createElement("jeep-sqlite");
      document.body.appendChild(jeepSqliteEl);

      await customElements.whenDefined("jeep-sqlite");
      console.log(`after customElements.whenDefined`);

      await sqlite.initWebStore();
      console.log(`after initWebStore`);
    }

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
