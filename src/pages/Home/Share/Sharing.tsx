import React, { useEffect } from "react";

import { FileSharer } from "@byteowls/capacitor-filesharer";
import { App } from "@capacitor/app";

import { AppLayout } from "@/components/layout";
import { db } from "@/hooks/useDexie";
import { useLiveQuery } from "dexie-react-hooks";
import * as htmlToImage from "html-to-image";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

const Sharing: React.FC = () => {
  const history = useHistory();

  const mensaje = useLiveQuery(() => db.mensajes.toCollection().first())

  const { panico, msgSource } = useSelector(
    (state: any) => state.home
  );

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
    if (mensaje?.mensaje || panico.texto) {
      requestAnimationFrame(() => {
        shareScreenshot();
      });
    }
  }, [mensaje, panico]);

  return (
    <AppLayout>
      <div id="content" className="bg-background p-4">
        <div className="text-center">
          <p style={{ whiteSpace: "pre-wrap" }}>
            {msgSource == "mensaje" ? mensaje?.mensaje : panico?.texto}
          </p>

          <img
            src="assets/images/logo_texto.png"
            style={{ width: "90px", display: "block", margin: "10px auto" }}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Sharing;
