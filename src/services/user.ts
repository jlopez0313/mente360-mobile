import { baseApi } from './api';

export const nextCrecimiento = async(formData: {}, userID: string): Promise<any> => {
    const { post } = await baseApi();
    return post('/usuarios/next_crecimiento/' + userID, formData, { 'Content-type': 'application/json' });
};

export const update = async(formData: {}, userID: string): Promise<any> => {
    const { put } = await baseApi();
    return put('/usuarios/' + userID, formData, { 'Content-type': 'application/json' });
};

export const invitar = async(formData: {}): Promise<any> => {
    const { post } = await baseApi();
    return post('/usuarios/invitar', formData, { 'Content-type': 'application/json' });
};

export const misContactos = async(formData: {}): Promise<any> => {
    const { post } = await baseApi();
    return post('/usuarios/contactos', formData, { 'Content-type': 'application/json' });
};

export const find = async(id: number): Promise<any> => {
    const { get } = await baseApi();
    return get('/usuarios/' + id);
};

export const trial = async(): Promise<any> => {
    const { get } = await baseApi();
    return get('/usuarios/trial');
};

// Registra el "último acceso" del usuario (last_seen_at). El backend hace
// throttle, así que se puede llamar sin miedo cada vez que la app se abre
// o vuelve del background.
export const heartbeat = async(): Promise<any> => {
    const { get } = await baseApi();
    return get('/heartbeat');
};

// Elimina la cuenta del usuario autenticado (menú de Configuración). Requiere
// reingresar la contraseña. El backend hace soft delete + anonimización del PII
// + cancelación de la suscripción en ePayco; el borrado físico definitivo lo hace
// un cron tras el periodo de gracia.
export const deleteAccount = async(password: string): Promise<any> => {
    const { post } = await baseApi();
    return post('/usuarios/eliminar-cuenta', { password }, { 'Content-type': 'application/json' });
};