import { getUser, setUser as set } from "@/helpers/onboarding";
import { createSlice } from "@reduxjs/toolkit";

const usuario = getUser();

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: { ...usuario.user } 
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
            set({user: {...action.payload} } )
        }
    }
});

export const { setUser } = userSlice.actions