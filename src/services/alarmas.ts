import {baseApi} from './api';
import { HttpHeaders } from '@capacitor/core';

export const all = async( ) => {

    return new Promise( async (resolve, reject) => {
        const { get } = baseApi();
    
        try {
            resolve ( await get('/alarmas', {"Accept": "application/json", "Content-type": "application/json" } ) )
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

export const create = async( payload: {} ) => {

    return new Promise( async (resolve, reject) => {
        const { post } = baseApi();
    
        try {
            resolve ( await post('/alarmas', payload, {"Accept": "application/json", "Content-type": "application/json" } ) )
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

export const toggle = async( id: string, payload: {} ) => {

    return new Promise( async (resolve, reject) => {
        const { put } = baseApi();
    
        try {
            resolve ( await put('/alarmas/' + id, payload, {"Accept": "application/json", "Content-type": "application/json" } ) )
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

export const remove = async( id: string ) => {

    return new Promise( async (resolve, reject) => {
        const { remove } = baseApi();
    
        try {
            resolve ( await remove('/alarmas/' + id, {}, {"Accept": "application/json", "Content-type": "application/json" } ) )
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