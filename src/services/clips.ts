import { baseApi } from './api';

export async function json(): Promise<any> {
    const { get } = await baseApi();
    return get('/clips/all', { 'Content-type': 'stream' });
}

export async function all(categoriasID: string, page = 0, search: string = '', fromDate: string = ''): Promise<any> {
    const { get } = await baseApi();
    return get(`/clips?page=${page}&search=${search}&last_sync=${fromDate}`, { 'Content-type': 'application/json' });
}

export async function byCategory(categoriasID: string, page = 0, search = '') {
    const { get } = await baseApi();
    return get(`/clips/by-categoria/${categoriasID}?page=${page}&search=${search}`, { 'Content-type': 'application/json' });
}

export async function trashed(fromDate: string = ''): Promise<any> {
    const { get } = await baseApi();
    return get(`/clips/trashed?last_sync=${fromDate}`, { 'Content-type': 'application/json' });
}