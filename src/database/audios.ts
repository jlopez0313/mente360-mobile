export default interface Audios {
  id?: number;
  eneatipo?: number;
  titulo: string;
  imagen: string;
  audio: string;
  done: number;
  // secuencia nocturna
  asignado?: boolean;
  escuchado?: boolean;
  // descarga offline
  audio_local?: string;
  imagen_local?: string;
  downloaded?: number;
}
