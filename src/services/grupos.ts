import {baseApi} from './api';
import { HttpHeaders } from '@capacitor/core';

export const create = async( formData: {} ) => {

    console.log(formData)

    return new Promise( async (resolve, reject) => {
        const { post } = baseApi();
    
        try {
            resolve ( await post('/grupos', formData, { "Content-type": "application/json" } ) )
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

export const getAll = async() => {

    return new Promise( async (resolve, reject) => {
        const { get } = baseApi();
    
        try {
            resolve ( await get('/grupos') )
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


export const find = async(id: number) => {

    return new Promise( async (resolve, reject) => {
        const { get } = baseApi();
    
        try {
            resolve ( await get('/grupos/' + id) )
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