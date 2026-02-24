import { baseApi } from './api';

export const find = async(payload: {}): Promise<any> => {
    const { post } = await baseApi();
    return post('/generate-subscribe-link', payload, { 'Accept': 'application/json', 'Content-type': 'application/json' });
};

export const getEpaycoLink = async(payload: {}): Promise<any> => {
    const { post } = await baseApi();
    return post('/suscripciones/epayco', payload, { 'Accept': 'application/json', 'Content-type': 'application/json' });
};