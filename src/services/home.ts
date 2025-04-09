import { baseApi } from './api';

export const getHome = async( formData: {} ): Promise<any> => {

    return new Promise( async (resolve, reject) => {
        const { post } = baseApi();
    
        try {
            resolve ( await post('/home', formData, { "Content-type": "application/json" } ) )
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

export const confirmAudio = async ( formData: any ): Promise<any> => {
    return new Promise( async (resolve, reject) => {
        const { post } = baseApi();
        try {
            resolve ( await post('/users_audios', formData, { "Content-type": "application/json" } ) )
        } catch (error: any) {
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

export const confirmMensaje = async ( formData: any ): Promise<any> => {
    return new Promise( async (resolve, reject) => {
        const { post } = baseApi();
        try {
            resolve ( await post('/users_mensajes', formData, { "Content-type": "application/json" } ) )
        } catch (error: any) {
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

export const confirmTarea = async ( formData: any ): Promise<any> => {
    return new Promise( async (resolve, reject) => {
        const { post } = baseApi();
        try {
            resolve ( await post('/users_tareas', formData, { "Content-type": "application/json" } ) )
        } catch (error: any) {
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
