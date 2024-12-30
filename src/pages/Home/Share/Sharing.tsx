import React, { useEffect, useState } from "react";
import { localDB } from "@/helpers/localStore";
import { IonContent, IonPage } from "@ionic/react";
import styles from "./Sharing.module.scss";

// import { App } from "@capacitor/app";

import { Share } from "@capacitor/share";
// import * as htmlToImage from "html-to-image";
import { useHistory } from "react-router";

const Sharing: React.FC = () => {
  const history = useHistory();

  const localHome = localDB("home");
  const [data, setData] = useState<any>({ mensaje: {}, tarea: {}, audio: {} });

  const onGetData = async () => {
    const localData = localHome.get();
    setData({ ...localData.data });

    await shareScreenshot();
  };

  const shareScreenshot = async () => {
    try {
      const modalElement = document.getElementById("content");
      if (!modalElement) return;
/*
      const dataUrl = await htmlToImage.toPng(modalElement);

      console.log( dataUrl.length )

      const handleAppStateChange = (state: { isActive: boolean }) => {
        if (state.isActive) {
          history.replace("/home");
          App.removeAllListeners();
        }
      };

      App.addListener("appStateChange", handleAppStateChange);
*/
      await Share.share({
        title: "Mensaje del día",
        text: "Comparte este inspirador mensaje",
        url: '',
        dialogTitle: "Compartir en redes sociales",
      });
    } catch (error) {
      console.error("Error al compartir la imagen:", error);
    }
  };

  useEffect(() => {
    onGetData();
  }, []);

  return (
    <IonPage>
      <IonContent>
        <div id="content" className={styles["content"]}>
          <div className={styles.texto}>
            <p style={{ whiteSpace: "pre-wrap" }}>{data.mensaje?.mensaje}</p>

            <img
              src="assets/images/logo_texto.png"
              style={{ width: "90px", display: "block", margin: "10px auto" }}
            />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Sharing;
