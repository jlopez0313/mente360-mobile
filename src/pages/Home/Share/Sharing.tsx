import { AppLayout } from "@/components/layout";
import { db } from "@/hooks/useDexie";
import { FileSharer } from "@byteowls/capacitor-filesharer";
import { App } from "@capacitor/app";
import { useLiveQuery } from "dexie-react-hooks";
import * as htmlToImage from "html-to-image";
import { MessageCircle, ShieldAlert } from "lucide-react";
import React, { useEffect } from "react";
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

      // Small delay to ensure styles are applied
      await new Promise(resolve => setTimeout(resolve, 500));

      const dataUrl = await htmlToImage.toPng(modalElement, {
        cacheBust: true,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
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
      <div className="flex items-center justify-center min-h-screen bg-muted/20 p-3">
        <div
          id="content"
          className="w-full max-w-[380px] rounded-xl border border-accent/10 shadow-xl overflow-hidden"
          style={{
            backgroundColor: '#ffffff', // Force white background for the image
            padding: '24px'
          }}
        >
          {/* Internal structure for the image */}
          <div className="flex flex-col gap-6" style={{ color: '#1a1a1a' }}> {/* Force dark text */}
            {/* Contextual Header inside the capture */}
            <div className="flex items-center gap-2" style={{ color: 'hsl(var(--accent))' }}>
              {msgSource === 'mensaje' ? (
                <MessageCircle className="w-5 h-5" />
              ) : (
                <ShieldAlert className="w-5 h-5" />
              )}
              <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                {msgSource === 'mensaje' ? 'Reflexión diaria' : 'Superando barreras'}
              </span>
            </div>

            {/* Main Message Section */}
            <div
              className="rounded-xl p-6 border border-accent/20"
              style={{ backgroundColor: '#fffbeb', borderColor: '#fce484ff' }}
            >
              <p className="text-lg leading-relaxed italic font-medium" style={{ color: '#1a1a1a' }}>
                {msgSource === "mensaje" ? mensaje?.mensaje : panico?.texto}
              </p>
              <p className="mt-4 font-bold text-right text-sm" style={{ color: 'hsl(var(--accent))' }}>
                - Mente 360
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Sharing;
