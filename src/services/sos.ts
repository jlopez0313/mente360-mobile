import { baseApi } from './api';

export async function activar(eneatipo: string): Promise<any> {
    const { get } = await baseApi();
    return get(`/sos_panico/random/${eneatipo}`, { 'Content-type': 'application/json' });
}