import { baseApi } from './api';

export async function json(): Promise<any> {
    const { get } = await baseApi();
    return get('/crecimientos/all', { 'Content-type': 'stream' });
}

export async function all(page = 0, fromDate: string = ''): Promise<any> {
    const { get } = await baseApi();
    return get(`/crecimientos?page=${page}&last_sync=${fromDate}`, { 'Content-type': 'application/json' });
}

export const byLevel = async(nivelesID: string, fromDate: string = ''): Promise<any> => {
    const { get } = await baseApi();
    return get(`/crecimientos/by-nivel/${nivelesID}?last_sync=${fromDate}`, { 'Content-type': 'application/json' });
};
