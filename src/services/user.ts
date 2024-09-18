import {baseApi} from './api';
import { HttpHeaders } from '@capacitor/core';

export const update = async( formData: {}, userID: string ) => {

    return new Promise( async (resolve, reject) => {
        const { put } = baseApi();
    
        try {
            resolve ( await put('/usuarios/' + userID, formData, { "Content-type": "application/json" } ) )
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

export const invitar = async( formData: {} ) => {

    return new Promise( async (resolve, reject) => {
        const { post } = baseApi();
    
        try {
            resolve ( await post('/usuarios/invitar', formData, { "Content-type": "application/json" } ) )
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

export const misContactos = async( formData: {} ) => {

    return new Promise( async (resolve, reject) => {
        const { post } = baseApi();
    
        try {
            resolve ( await post('/usuarios/contactos', formData, { "Content-type": "application/json" } ) )
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