import {baseApi} from './api';
import { HttpHeaders } from '@capacitor/core';

export const semana = async( ) => {

    return new Promise( async (resolve, reject) => {
        const { get } = baseApi();
    
        try {
            resolve ( await get('/notificaciones/semana', { "Content-type": "application/json" } ) )
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