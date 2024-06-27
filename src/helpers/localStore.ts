
export const localDB = ( key: string ) => {
    const clear = ( ) => {
        return localStorage.removeItem(key)
    }
    
    const set = ( user: any ) => {
        return localStorage.setItem(key, JSON.stringify( user ) )
    }
    
    const get = () => {
        return JSON.parse(localStorage.getItem(key) || '{}' )
    }

    return {
        clear,
        set,
        get
    }
}