import { baseApi } from './api';

export const create = async(formData: {}): Promise<any> => {
    const { post } = await baseApi();
    return post('/grupos', formData, { 'Content-type': 'application/json' });
};

export const getAll = async(fromDate: string = ''): Promise<any> => {
    const { get } = await baseApi();
    return get(`/grupos?last_sync=${fromDate}`);
};

export const find = async(id: number): Promise<any> => {
    const { get } = await baseApi();
    return get('/grupos/' + id);
};