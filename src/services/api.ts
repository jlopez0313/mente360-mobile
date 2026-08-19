import { getPreference, KEYS } from '@/helpers/preferences';
import { CapacitorHttp } from '@capacitor/core';

const baseURL = import.meta.env.VITE_BASE_API;

const getHeaders = async (customHeaders: Record<string, string> = {}) => {
    const token = await getPreference(KEYS.TOKEN);
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        ...customHeaders,
    };
};

const isSuccess = (status: number) => status >= 200 && status < 300;

export const baseApi = async () => {
    const get = async (url: string, customHeaders: Record<string, string> = {}) => {
        const headers = await getHeaders(customHeaders);
        const response = await CapacitorHttp.get({ url: `${baseURL}${url}`, headers });

        if (isSuccess(response.status)) {
            return response;
        }
        throw response;
    };

    const post = async (url: string, formData: unknown, customHeaders: Record<string, string> = {}) => {
        const headers = await getHeaders(customHeaders);
        const response = await CapacitorHttp.post({
            url: `${baseURL}${url}`,
            headers,
            data: formData,
        });

        if (isSuccess(response.status)) {
            return response;
        }
        throw response;
    };

    const put = async (url: string, formData: unknown, customHeaders: Record<string, string> = {}) => {
        const headers = await getHeaders(customHeaders);
        const response = await CapacitorHttp.put({
            url: `${baseURL}${url}`,
            headers,
            data: formData,
        });

        if (isSuccess(response.status)) {
            return response;
        }
        throw response;
    };

    const remove = async (url: string, formData: unknown, customHeaders: Record<string, string> = {}) => {
        const headers = await getHeaders(customHeaders);
        const response = await CapacitorHttp.delete({
            url: `${baseURL}${url}`,
            headers,
            data: formData,
        });

        if (isSuccess(response.status)) {
            return response;
        }
        throw response;
    };

    return { get, post, put, remove };
};