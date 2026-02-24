import { baseApi } from './api';

export const all = async(): Promise<any> => {
    const { get } = await baseApi();
    return get('/alarmas', { 'Accept': 'application/json', 'Content-type': 'application/json' });
};

export const create = async(payload: {}) => {
    const { post } = await baseApi();
    return post('/alarmas', payload, { 'Accept': 'application/json', 'Content-type': 'application/json' });
};

export const toggle = async(id: string, payload: {}) => {
    const { put } = await baseApi();
    return put('/alarmas/' + id, payload, { 'Accept': 'application/json', 'Content-type': 'application/json' });
};

export const remove = async(id: string) => {
    const { remove } = await baseApi();
    return remove('/alarmas/' + id, {}, { 'Accept': 'application/json', 'Content-type': 'application/json' });
};