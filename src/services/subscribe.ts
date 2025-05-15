import { baseApi } from './api';

export const find = async(payload: {}): Promise<any> => {

    return new Promise( async (resolve, reject) => {
        const { post } = baseApi();
    
        try {
            resolve ( await post(`/generate-subscribe-link`, payload, {"Accept": "application/json", "Content-type": "application/json" } ) )
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