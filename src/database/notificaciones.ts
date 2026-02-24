import Comunidades from "./comunidades";

export default interface Notificaciones {
    id: string; // The backend seems to return a string ID or we use string for robustness
    user_id: string;
    notificacion: string;
    created_at: string;
    comunidad?: Comunidades;
    // Local flags for persistence overriding backend state
    isRead?: boolean;
    isDeleted?: boolean;
}
