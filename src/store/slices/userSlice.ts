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
            const isDifferentUser = action.payload?.id && state.user?.id && action.payload.id !== state.user.id;
            const newUser = isDifferentUser ? action.payload : { ...state.user, ...action.payload };
            state.user = newUser;
            set({ user: newUser });
        }
    }
});

export const { setUser } = userSlice.actions