import { baseApi } from './api';

export const all = async(): Promise<any> => {
    const { get } = await baseApi();
    return get('/notificaciones', { 'Content-type': 'application/json' });
};

export const semana = async(): Promise<any> => {
    const { get } = await baseApi();
    return get('/notificaciones/semana', { 'Content-type': 'application/json' });
};