import { IonContent, IonPage } from "@ionic/react";
import React, { useEffect } from "react";
import styles from "./Sharing.module.scss";

import { FileSharer } from "@byteowls/capacitor-filesharer";
import { App } from "@capacitor/app";

import * as htmlToImage from "html-to-image";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

const Sharing: React.FC = () => {
  const history = useHistory();

  const { mensaje } = useSelector((state: any) => state.home);

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
    if (mensaje.mensaje) {
      shareScreenshot();
    }
  }, [mensaje]);

  return (
    <IonPage>
      <IonContent className={styles["ion-content"]}>
        <div id="content" className={styles["content"]}>
          <div className={styles.texto}>
            <p style={{ whiteSpace: "pre-wrap" }}>{mensaje?.mensaje}</p>

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
