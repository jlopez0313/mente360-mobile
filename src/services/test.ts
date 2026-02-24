import { baseApi } from './api';

export const test = async(formData: {}): Promise<any> => {
    const { post } = await baseApi();
    return post('/usuarios/test', formData, { 'Content-type': 'application/json' });
};