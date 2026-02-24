import { baseApi } from './api';

export const sendPush = async(payload: any) => {
    const { post } = await baseApi();
    return post('/send-push', payload, { 'Content-type': 'application/json' });
};