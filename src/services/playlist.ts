import { baseApi } from './api';

export const all = async( fromDate: string = '' ): Promise<any> => {

    return new Promise( async (resolve, reject) => {
        const { get } = baseApi();
    
        try {
            resolve ( await get(`/playlist?last_sync=${fromDate}`, {"Accept": "application/json", "Content-type": "application/json" } ) )
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

export const add = async( payload: {} ): Promise<any> => {

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

export const trash = async( id: number ): Promise<any> => {

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