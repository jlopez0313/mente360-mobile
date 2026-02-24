import { baseApi } from './api';

export const getHome = async(formData: {}): Promise<any> => {
    const { post } = await baseApi();
    return post('/home', formData, { 'Content-type': 'application/json' });
};

export const confirmAudio = async(formData: any): Promise<any> => {
    const { post } = await baseApi();
    return post('/users_audios', formData, { 'Content-type': 'application/json' });
};

export const confirmMensaje = async(formData: any): Promise<any> => {
    const { post } = await baseApi();
    return post('/users_mensajes', formData, { 'Content-type': 'application/json' });
};

export const confirmTarea = async(formData: any): Promise<any> => {
    const { post } = await baseApi();
    return post('/users_tareas', formData, { 'Content-type': 'application/json' });
};
