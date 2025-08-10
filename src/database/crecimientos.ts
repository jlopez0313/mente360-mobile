import Niveles from "./niveles";

export default interface Crecimientos {
  id: number;
  nivel: Niveles;
  titulo: string;
  imagen: string;
  audio: string;
  downloaded?: number;
  imagen_local: string;
  audio_local: string;
}
