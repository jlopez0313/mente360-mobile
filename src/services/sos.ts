import { baseApi } from './api';

export async function activar ( eneatipo: string): Promise<any> {

    return new Promise( async (resolve, reject) => {
        const { get } = baseApi();
    
        try {
            resolve ( await get(`/sos_panico/random/${eneatipo}`, { "Content-type": "application/json" } ) )
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