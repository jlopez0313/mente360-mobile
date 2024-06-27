import { CapacitorHttp, HttpHeaders } from '@capacitor/core';
import { } from '@ionic-native/http';
import { getUser } from '@/helpers/onboarding';

/*
import axios from "axios";

export const baseApi = axios.create({
    baseURL: import.meta.env.VITE_BASE_API
})

baseApi.interceptors.request.use((config) => {
    const user = getUser();
    config.headers.Authorization =  user ? `Bearer ${user.token}` : '';
    return config;
})

*/

export const baseApi = () => {
    
    const baseURL = import.meta.env.VITE_BASE_API;
    
    const headers = () => {
        const user = getUser();
        const Authorization =  user?.token ? `Bearer ${user.token}` : '';
        return { 
            Authorization,
        };
    }

    const get = async (url: string, customHeaders: any = {}) => {
        const myHeaders = headers();
        
        const options = {
            url: `${baseURL}${url}`,
            headers: { 
                ...myHeaders,
                ...customHeaders
            }
        };

        const response = await CapacitorHttp.get(options);
        // const response = await axios.get( options.url, { headers: options.headers } );


        if( response.status == 200 || response.status == 201 ) {
            return Promise.resolve( response )
        } else {
            return Promise.reject( response )
        }
    };
    
    const post = async (url: string, formData: any, customHeaders: any = {}) => {
        const myHeaders = headers();

        const options = {
            url: `${baseURL}${url}`,
            headers: { 
                ...myHeaders,
                ...customHeaders
            },
            data: formData
        };

        const response = await CapacitorHttp.post( options )
        // const response = await axios.post( options.url, options.data, { headers: options.headers } );

        if( response.status == 200 || response.status == 201 ) {
            return Promise.resolve( response )
        } else {
            return Promise.reject( response )
        }
    }


    const put = async (url: string, formData: any, customHeaders: any = {}) => {
        const myHeaders = headers();

        const options = {
            url: `${baseURL}${url}`,
            headers: { 
                ...myHeaders,
                ...customHeaders
            },
            data: formData
        };

        const response = await CapacitorHttp.put( options )

        if( response.status == 200 || response.status == 201 ) {
            return Promise.resolve( response )
        } else {
            return Promise.reject( response )
        }
    };

    const remove = async (url: string, formData: any, customHeaders: any = {}) => {
        const myHeaders = headers();

        const options = {
            url: `${baseURL}${url}`,
            headers: { 
                ...myHeaders,
                ...customHeaders
            },
            data: formData
        };

        const response = await CapacitorHttp.delete( options )

        if( response.status == 200 || response.status == 201 ) {
            return Promise.resolve( response )
        } else {
            return Promise.reject( response )
        }
    }

    return { get, post, put, remove }

}