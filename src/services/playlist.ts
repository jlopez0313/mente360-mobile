import {baseApi} from './api';
import { HttpHeaders } from '@capacitor/core';

export const all = async( ) => {

    return new Promise( async (resolve, reject) => {
        const { get } = baseApi();
    
        try {
            resolve ( await get('/playlist', {"Accept": "application/json", "Content-type": "application/json" } ) )
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

export const add = async( payload: {} ) => {

    return new Promise( async (resolve, reject) => {
        const { post } = baseApi();
    
        try {
            resolve ( await post('/playlist', payload, {"Accept": "application/json", "Content-type": "application/json" } ) )
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

export const trash = async( id: string ) => {

    return new Promise( async (resolve, reject) => {
        const { remove } = baseApi();
    
        try {
            resolve ( await remove('/playlist/' + id, {}, {"Accept": "application/json", "Content-type": "application/json" } ) )
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