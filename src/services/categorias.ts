import { baseApi } from './api';

export const all = async(fromDate: string = ''): Promise<any> => {
    const { get } = await baseApi();
    return get(`/categorias?last_sync=${fromDate}`, { 'Content-type': 'application/json' });
};