import { baseApi } from './api';

export const all = async(fromDate: string = ''): Promise<any> => {
    const { get } = await baseApi();
    return get(`/playlist?last_sync=${fromDate}`, { 'Accept': 'application/json', 'Content-type': 'application/json' });
};

export const add = async(payload: {}): Promise<any> => {
    const { post } = await baseApi();
    return post('/playlist', payload, { 'Accept': 'application/json', 'Content-type': 'application/json' });
};

export const trash = async(id: number): Promise<any> => {
    const { remove } = await baseApi();
    return remove('/playlist/' + id, {}, { 'Accept': 'application/json', 'Content-type': 'application/json' });
};