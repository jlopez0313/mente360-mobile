import { openWhatsApp } from "@/helpers/Whatsapp";
import { usePreferences } from "@/hooks/usePreferences";
import { setRoute } from "@/store/slices/routeSlice";
import {
  IonSkeletonText,
  IonAvatar,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonContent,
  IonMenuToggle,
  IonButton,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonToggle,
  ToggleCustomEvent,
  useIonToast,
} from "@ionic/react";
import {
  callOutline,
  cogOutline,
  documentLockOutline,
  documentTextOutline,
  hammerOutline,
  peopleOutline
} from "ionicons/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import styles from "./Configuracion.module.scss";
import Avatar from "@/assets/images/avatar.jpg";
import whatsapp from "/assets/icons/whatsapp.svg";

export const Configuracion = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { removePreference, keys } = usePreferences();

  const [presentToast] = useIonToast();
  const baseURL = import.meta.env.VITE_BASE_BACK;
  const { usuario } = useSelector((state: any) => state.user);

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
      if (key !== keys.TOKEN)
        removePreference(keys[key]);
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
    <IonMenu contentId="main-content"
      onIonWillOpen={() => {
        const content = document.getElementById("main-content");
        if (content) {
          // Ocultamos visualmente el contenido antes de que el menú empiece a aparecer
          //content.style.transition = "opacity 0.2s ease";
          //content.style.opacity = "0.6";
          // Le damos un pequeño retardo antes de ponerlo detrás
          setTimeout(() => {
            content.style.zIndex = "-1";
          }, 150);
        }
      }}
      onIonDidClose={() => {
        const content = document.getElementById("main-content");
        if (content) {
          content.style.zIndex = "0";
          content.style.opacity = "1";
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
                //src={usuario.photo ? baseURL + usuario.photo : Avatar}
                src={Avatar}
                onLoad={() => setIsLoading(false)}
              />
            </IonAvatar> 

            <IonLabel>
              <h2 style={{ color: '#4b4b4b', margin: 0 }}>Alejandro Mendoza</h2>
              <p style={{ color: '#4b4b4b', margin: 0 }}>@alejandro</p>
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
                  <IonItem button={true} >
                  <span slot="start" className="material-symbols-outlined">account_circle</span>
                    <IonLabel>Editar Perfil</IonLabel>
                  </IonItem>
                </Link>

                <Link to="/recordatorios">
                  <IonItem button={true} >
                  <span slot="start" className="material-symbols-outlined">alarm</span>
                    <IonLabel>Mis Recordatorios</IonLabel>
                  </IonItem>
                </Link>

                <IonItem button={true} lines="none" >
                  <span slot="start" className="material-symbols-outlined">dark_mode</span>

                  <IonToggle
                    mode="md" 
                    checked={paletteToggle}
                    onIonChange={toggleChange}
                    className="custom-toggle"
                  >
                    <IonLabel>Modo Oscuro</IonLabel>
                  </IonToggle>
                </IonItem>

                <Link to="/test">
                  <IonItem button={true} >
                  <span slot="start" className="material-symbols-outlined">stars</span>
                    <IonLabel>Realizar Test Eneagrama</IonLabel>
                  </IonItem>
                </Link>
                {/*
                <Link to="/recordatorios">
                  <IonItem button={true}>
                    <IonIcon slot="start" icon={timeOutline} />
                    <IonLabel>Mis Recordatorios</IonLabel>
                  </IonItem>
                </Link>
      */}
              </IonItemGroup>
            </IonList>
            
            <IonItemDivider className="line-divider"></IonItemDivider>

            <IonList inset={true}>
              <IonItemGroup>
                

                <IonItem
                  lines="none"

                  onClick={() => {
                    window.open("https://soymente360.com/#quienes-somos", "_blank");
                  }}
                >
                  <span slot="start" className="material-symbols-outlined">groups</span>
                  <IonLabel>Sobre Nosotros</IonLabel>
                </IonItem>

                <IonItem
                  lines="none"

                  onClick={() => {
                    window.open("https://soymente360.com/terminos_condiciones.html", "_blank");
                  }}
                >
                  <span slot="start" className="material-symbols-outlined">insert_drive_file</span>
                  <IonLabel>Términos y Condiciones</IonLabel>
                </IonItem>

                <IonItem
                  lines="none"
                  onClick={() => {
                    window.open("https://soymente360.com/politica_privacidad.html", "_blank");
                  }}
                >
                  <span slot="start" className="material-symbols-outlined">admin_panel_settings</span>
                  <IonLabel>Política de Privacidad</IonLabel>
                </IonItem>
              </IonItemGroup>
            </IonList>
            
            <IonItemDivider className="line-divider"></IonItemDivider>

            <IonList inset={true}>
              <IonItemGroup>
                
              </IonItemGroup>

              <IonItem
                lines="none"

                onClick={() =>
                  openWhatsApp(
                    import.meta.env.VITE_SUPPORT_PHONE,
                    `Hola, tengo un problema con la aplicación ${import.meta.env.VITE_NAME
                    } y necesito ayuda. Esto es lo que me sucede: `
                  )
                }
              >
                <span slot="start" className="material-symbols-outlined">support_agent</span>
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
                    `¡Hola! Me gustaría obtener más información sobre su servicio en ${import.meta.env.VITE_NAME
                    }. ¿Podrían ayudarme?`
                  )
                }
              >
                <IonIcon className="menu-icon" slot="start" src={whatsapp}/>
                <IonLabel>Escríbenos</IonLabel>
              </IonItem>
              
            </IonList>

            <IonItemDivider className="line-divider"></IonItemDivider>

            <IonList inset={true}>
              <IonItemGroup>
                  
                <IonItem lines="none"  onClick={onLogout}>
                  <span slot="start" className="material-symbols-outlined">logout</span>
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
