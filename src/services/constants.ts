import { baseApi } from './api';

export const all = async(): Promise<any> => {
    const { get } = await baseApi();
    return get('/constants', { 'Content-type': 'application/json' });
};