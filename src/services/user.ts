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