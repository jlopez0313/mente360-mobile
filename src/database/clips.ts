import Categorias from "./categorias";

export default interface Clips {
    id?: number;
    categoria ?: Categorias;
    titulo: string;
    imagen: string;
    audio: string;
    downloaded ?: number;
    imagen_local: string;
    audio_local: string;
}