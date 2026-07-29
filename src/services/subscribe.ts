import { baseApi } from './api';

export const find = async(payload: {}): Promise<any> => {
    const { post } = await baseApi();
    return post('/generate-subscribe-link', payload, { 'Accept': 'application/json', 'Content-type': 'application/json' });
};

export const getEpaycoPublicKey = async(): Promise<any> => {
    const { get } = await baseApi();
    return get('/suscripciones/epayco/public-key', { 'Accept': 'application/json' });
};

export const subscribeEpayco = async(payload: {}): Promise<any> => {
    const { post } = await baseApi();
    return post('/suscripciones/epayco/subscribe', payload, { 'Accept': 'application/json', 'Content-type': 'application/json' });
};

export const cancelEpayco = async(): Promise<any> => {
    const { post } = await baseApi();
    return post('/suscripciones/epayco/cancel', {}, { 'Accept': 'application/json' });
};