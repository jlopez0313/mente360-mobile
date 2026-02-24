import { baseApi } from './api';

export const all = async(fromDate: string = ''): Promise<any> => {
    const { get } = await baseApi();
    return get(`/likes?last_sync=${fromDate}`, { 'Accept': 'application/json', 'Content-type': 'application/json' });
};

export const like = async(payload: {}): Promise<any> => {
    const { post } = await baseApi();
    return post('/likes', payload, { 'Accept': 'application/json', 'Content-type': 'application/json' });
};

export const dislike = async(id: number): Promise<any> => {
    const { remove } = await baseApi();
    return remove('/likes/' + id, {}, { 'Accept': 'application/json', 'Content-type': 'application/json' });
};