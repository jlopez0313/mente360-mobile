import { baseApi } from './api';

export const all = async(fromDate: string = ''): Promise<any> => {
    const { get } = await baseApi();
    return get(`/categorias/all?last_sync=${fromDate}`, { 'Content-type': 'application/json' });
};