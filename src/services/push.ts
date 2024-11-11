import {baseApi} from './api';
import { HttpHeaders } from '@capacitor/core';

export const sendPush = async( payload: any ) => {

    return new Promise( async (resolve, reject) => {
        const { post } = baseApi();
    
        try {
            resolve ( await post('/send-push', payload, { "Content-type": "application/json" } ) )
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