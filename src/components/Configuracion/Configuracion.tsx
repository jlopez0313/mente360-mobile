import Avatar from "@/assets/images/avatar.jpg";
import { openWhatsApp } from "@/helpers/Whatsapp";
import { usePreferences } from "@/hooks/usePreferences";
import { setRoute } from "@/store/slices/routeSlice";
import {
  IonAvatar,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonSkeletonText,
  IonToggle,
  IonToolbar,
  ToggleCustomEvent,
  useIonToast,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import styles from "./Configuracion.module.scss";
import whatsapp from "/assets/icons/whatsapp.svg";

export const Configuracion = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { removePreference, keys } = usePreferences();

  const [presentToast] = useIonToast();
  const baseURL = import.meta.env.VITE_BASE_BACK;
  const { user } = useSelector((state: any) => state.user);
  
  const [isLoading, setIsLoading] = useState(true);
  const onLogout = async () => {
    localStorage.removeItem("home");
    localStorage.removeItem("onboarding");

    await removePreference(keys.TOKEN);
    await removePreference(keys.HOME_SYNC_KEY);

    history.replace("/login");
  };

  useEffect(() => {
    dispatch(setRoute("/configuracion"));
  }, []);

  const [paletteToggle, setPaletteToggle] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const toggleChange = (ev: ToggleCustomEvent) => {
    localStorage.setItem("darkMode", ev.detail.checked.toString());
    toggleDarkPalette(ev.detail.checked);
  };

  const toggleDarkPalette = (shouldAdd: boolean) => {
    document.documentElement.classList.toggle("ion-palette-dark", shouldAdd);
    document.body.classList.toggle("dark", shouldAdd);
  };

  const onDownloadBackup = async () => {
    // await makeBackup();
    onPresentToast("bottom", "El Backup ha sido descargado.", "");
  };

  const onClearPreferences = () => {
    Object.keys(keys).forEach((key: string) => {
      if (key !== keys.TOKEN) removePreference(keys[key]);
    });

    onPresentToast("bottom", "Preferencias Eliminadas.", "");
  };

  const onDownloadJson = async () => {
    // await exportJson();
    onPresentToast("bottom", "El Backup ha sido descargado.", "");
  };

  const onPresentToast = (
    position: "top" | "middle" | "bottom",
    message: string,
    icon: any
  ) => {
    presentToast({
      message: message,
      duration: 2000,
      position: position,
      icon: icon,
    });
  };

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    const isDarkMode = savedMode === "true";
    setPaletteToggle(isDarkMode);
    toggleDarkPalette(isDarkMode);
  }, []);

  return (
    <IonMenu
      contentId="main-content"
      onIonWillOpen={() => {
        const content = document.getElementById("main-content");
        const player = document.getElementById("player");
        if (content) {
          setTimeout(() => {
            content.style.zIndex = "-1";
          }, 150);
        }

        if (player) {
          setTimeout(() => {
            player.style.zIndex = "-1";
          }, 150);
        }
      }}
      onIonDidClose={() => {
        const content = document.getElementById("main-content");
        const player = document.getElementById("player");

        if (content) {
          content.style.zIndex = "0";
          content.style.opacity = "1";
        }
        if (player) {
          player.style.zIndex = "1";
        }
      }}
    >
      <IonHeader>
        <IonToolbar className="bg-secondary minheight186">
          <IonItem lines="none" className="flex bg-secondary minheight186">
            {isLoading && (
              <IonSkeletonText
                animated
                className={`ion-margin-top ${styles["profile-image"]}`}
              />
            )}
            <IonAvatar className="menu-avatar" slot="start">
              <img
                src={user.photo ? baseURL + user.photo : Avatar}
                onLoad={() => setIsLoading(false)}
              />
            </IonAvatar>

            <IonLabel>
              <h2 style={{ color: "#4b4b4b", margin: 0 }}>{user?.name}</h2>
              <h3 className="ion-left" style={{ color: "#4b4b4b", margin: 0 }}>
                {user?.email}
              </h3>
            </IonLabel>
          </IonItem>
        </IonToolbar>
      </IonHeader>
      <IonContent className={styles["bg-menu"]}>
        <IonMenuToggle autoHide={true}>
          <div className={styles["ion-content"]}>
            <IonList inset={true}>
              <IonItemGroup>
                <Link to="/perfil">
                  <IonItem button={true}>
                    <span slot="start" className="material-symbols-outlined">
                      account_circle
                    </span>
                    <IonLabel>Editar Perfil</IonLabel>
                  </IonItem>
                </Link>

                <IonItem button={true} lines="none">
                  <span slot="start" className="material-symbols-outlined">
                    dark_mode
                  </span>

                  <IonToggle
                    mode="md"
                    checked={paletteToggle}
                    onIonChange={toggleChange}
                    className="custom-toggle"
                  >
                    <IonLabel>Modo Oscuro</IonLabel>
                  </IonToggle>
                </IonItem>

                <Link to="/recordatorios">
                  <IonItem button={true}>
                    <span slot="start" className="material-symbols-outlined">
                      alarm
                    </span>
                    <IonLabel>Mis Recordatorios</IonLabel>
                  </IonItem>
                </Link>

                <Link to="/test">
                  <IonItem button={true}>
                    <span slot="start" className="material-symbols-outlined">
                      stars
                    </span>
                    <IonLabel>Realizar Test Eneagrama </IonLabel>
                  </IonItem>
                </Link>
                <Link to="/comunidad-principal">
                  <IonItem button={true}>
                    <span slot="start" className="material-symbols-outlined">
                      diversity_3
                    </span>
                    <IonLabel>Seleccionar comunidad activa</IonLabel>
                  </IonItem>
                </Link>
              </IonItemGroup>

              <IonItemDivider
                className={styles["line-divider"]}
              ></IonItemDivider>

              <IonItemGroup>
                <IonItem
                  lines="none"
                  onClick={() => {
                    window.open(
                      "https://soymente360.com/#quienes-somos",
                      "_blank"
                    );
                  }}
                >
                  <span slot="start" className="material-symbols-outlined">
                    groups
                  </span>
                  <IonLabel>Sobre Nosotros</IonLabel>
                </IonItem>

                <IonItem
                  lines="none"
                  onClick={() => {
                    window.open(
                      "https://soymente360.com/terminos_condiciones.html",
                      "_blank"
                    );
                  }}
                >
                  <span slot="start" className="material-symbols-outlined">
                    insert_drive_file
                  </span>
                  <IonLabel>Términos y Condiciones</IonLabel>
                </IonItem>

                <IonItem
                  lines="none"
                  onClick={() => {
                    window.open(
                      "https://soymente360.com/politica_privacidad.html",
                      "_blank"
                    );
                  }}
                >
                  <span slot="start" className="material-symbols-outlined">
                    admin_panel_settings
                  </span>
                  <IonLabel>Política de Privacidad</IonLabel>
                </IonItem>
              </IonItemGroup>

              <IonItemDivider
                className={styles["line-divider"]}
              ></IonItemDivider>

              <IonItemGroup>
                <IonItem
                  lines="none"
                  onClick={() =>
                    openWhatsApp(
                      import.meta.env.VITE_SUPPORT_PHONE,
                      `Hola, tengo un problema con la aplicación ${
                        import.meta.env.VITE_NAME
                      } y necesito ayuda. Esto es lo que me sucede: `
                    )
                  }
                >
                  <span slot="start" className="material-symbols-outlined">
                    support_agent
                  </span>
                  <IonLabel>Soporte</IonLabel>
                </IonItem>
                {/* 

              <IonItem
                lines="none"
                
                onClick={async () => onDownloadBackup()}
              >
                <IonIcon slot="start" icon={downloadOutline} />
                <IonLabel>Backup BD</IonLabel>
              </IonItem>

              <IonItem
                lines="none"
                
                onClick={async () => onDownloadJson()}
              >
                <IonIcon slot="start" icon={downloadOutline} />
                <IonLabel>Backup JSON</IonLabel>
              </IonItem>

              <IonItem
                lines="none"
                
                onClick={async () => onClearPreferences()}
              >
                <IonIcon slot="start" icon={trashOutline} />
                <IonLabel>Limpiar Preferencias</IonLabel>
              </IonItem>
      */}
                <IonItem
                  onClick={() =>
                    openWhatsApp(
                      import.meta.env.VITE_CONTACT_PHONE,
                      `¡Hola! Me gustaría obtener más información sobre su servicio en ${
                        import.meta.env.VITE_NAME
                      }. ¿Podrían ayudarme?`
                    )
                  }
                >
                  <IonIcon className="menu-icon" slot="start" src={whatsapp} />
                  <IonLabel>Escríbenos</IonLabel>
                </IonItem>
              </IonItemGroup>

              <IonItemDivider
                className={styles["line-divider"]}
              ></IonItemDivider>

              <IonItemGroup>
                <IonItem lines="none" onClick={onLogout}>
                  <span slot="start" className="material-symbols-outlined">
                    logout
                  </span>
                  <IonLabel>Cerrar Sesión</IonLabel>
                </IonItem>
              </IonItemGroup>
            </IonList>
          </div>
        </IonMenuToggle>
      </IonContent>
    </IonMenu>
  );
};
