

import {baseApi} from './api';
import { HttpHeaders } from '@capacitor/core';

export const all = async( nivelesID: string ) => {

    return new Promise( async (resolve, reject) => {
        const { get } = baseApi();
    
        try {
            resolve ( await get('/crecimientos/by-nivel/' + nivelesID, { "Content-type": "application/json" } ) )
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