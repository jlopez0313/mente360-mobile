import {baseApi} from './api';
import { HttpHeaders } from '@capacitor/core';

export const update = async( formData: {}, useID: string ) => {

    return new Promise( async (resolve, reject) => {
        const { put } = baseApi();
    
        try {
            resolve ( await put('/usuarios/' + useID, formData, { "Content-type": "application/json" } ) )
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