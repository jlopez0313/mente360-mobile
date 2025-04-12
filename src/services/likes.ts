import { baseApi } from './api';

export const all = async( fromDate: string = '' ): Promise<any> => {

    return new Promise( async (resolve, reject) => {
        const { get } = baseApi();
    
        try {
            resolve ( await get(`/likes?last_sync=${fromDate}`, {"Accept": "application/json", "Content-type": "application/json" } ) )
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

export const like = async( payload: {} ): Promise<any> => {

    return new Promise( async (resolve, reject) => {
        const { post } = baseApi();
    
        try {
            resolve ( await post('/likes', payload, {"Accept": "application/json", "Content-type": "application/json" } ) )
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

export const dislike = async( id: string ): Promise<any> => {

    return new Promise( async (resolve, reject) => {
        const { remove } = baseApi();
    
        try {
            resolve ( await remove('/likes/' + id, {}, {"Accept": "application/json", "Content-type": "application/json" } ) )
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