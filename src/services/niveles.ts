import { baseApi } from './api';

export const all = async(fromDate: string = ''): Promise<any> => {
    const { get } = await baseApi();
    return get(`/niveles/all?last_sync=${fromDate}`, { 'Content-type': 'application/json' });
};