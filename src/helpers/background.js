import { BackgroundMode } from "@anuradev/capacitor-background-mode";

export const startBackground = async () => {
  // await BackgroundMode.disable();

  const isEnabled = await BackgroundMode.isEnabled();
  
  if (!isEnabled) {
      BackgroundMode.setSettings({
        title: "Reproduciendo Podcast",
        text: "Tu podcast está en reproducción.",
        icon: "icon", // Nombre del archivo del ícono
        color: "F14F4D", // Color de la notificación
      });
    
      await BackgroundMode.enable();
  }

  const isScreenOff = await BackgroundMode.isScreenOff();
  if (isScreenOff) {
    BackgroundMode.wakeUp()
  }

};
