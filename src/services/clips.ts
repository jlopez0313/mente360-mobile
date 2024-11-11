

import {baseApi} from './api';
import { HttpHeaders } from '@capacitor/core';

export const all = async( categoriasID: string, page = 0, search='' ) => {

    return new Promise( async (resolve, reject) => {
        const { get } = baseApi();
    
        try {
            resolve ( await get(`/clips?page=${page}&search=${search}`, { "Content-type": "application/json" } ) )
        } catch( error: any ) {
            if (error.response) {
                reject(error.response)
            } else if (error.request) {
                reject(error.request)
            } else {
                reject(error)
            }
        }    
    })
    
}

export const byCategory = async( categoriasID: string, page = 0, search = '' ) => {

    return new Promise( async (resolve, reject) => {
        const { get } = baseApi();
    
        try {
            resolve ( await get(`/clips/by-categoria/${categoriasID}?page=${page}&search=${search}`, { "Content-type": "application/json" } ) )
        } catch( error: any ) {
            if (error.response) {
                reject(error.response)
            } else if (error.request) {
                reject(error.request)
            } else {
                reject(error)
            }
        }    
    })
    
}