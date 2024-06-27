export const clearUser = ( ) => {
    return localStorage.removeItem('onboarding')
}

export const setUser = ( user: any ) => {
    return localStorage.setItem('onboarding', JSON.stringify( user ) )
}

export const getUser = () => {
    return JSON.parse(localStorage.getItem('onboarding') || '{}' )
}