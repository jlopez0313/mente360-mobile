import React, { useCallback, useEffect, useRef, useState } from "react";
import { localDB } from "@/helpers/localStore";
import { IonContent, IonPage } from "@ionic/react";
import styles from "./Sharing.module.scss";

import { App } from "@capacitor/app";
import { FileSharer } from "@byteowls/capacitor-filesharer";

import * as htmlToImage from "html-to-image";
import { useHistory } from "react-router";

const Sharing: React.FC = () => {
  const history = useHistory();

  const localHome = localDB("home");
  const [data, setData] = useState<any>({ mensaje: {}, tarea: {}, audio: {} });

  const onGetData = async () => {
    const localData = localHome.get();
    setData({ ...localData.data });
  };

  const shareScreenshot = async () => {
    try {
      const modalElement = document.getElementById("content");
      if (!modalElement) {
        console.error("El elemento de contenido no se encontró.");
        return;
      }

      const dataUrl = await htmlToImage.toPng(modalElement, {
        cacheBust: true,
      });

      if (!dataUrl) {
        console.error("No se pudo generar la imagen.");
        return;
      }

      console.log("dataURL", dataUrl);

      const base64Data = dataUrl.split(",")[1];
      const filename = `mente360-${Date.now()}.png`;

      const handleAppStateChange = (state: { isActive: boolean }) => {
        if (state.isActive) {
          history.replace("/home");
          App.removeAllListeners();
        }
      };

      App.addListener("appStateChange", handleAppStateChange);

      await FileSharer.share({
        filename,
        contentType: "image/png",
        base64Data,
      });
    } catch (error) {
      console.error("Error al compartir la imagen:", error);
    }
  };

  useEffect(() => {
    onGetData();
  }, []);

  useEffect(() => {
    if (data.mensaje?.mensaje) {
      shareScreenshot();
    }
  }, [data]);

  return (
    <IonPage>
      <IonContent className={styles["ion-content"]}>
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
