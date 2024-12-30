import { createSlice } from "@reduxjs/toolkit";

export const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notificaciones: [],
        isGeneral: false,
        isGrupo: false,
        isRoom: false,
    },
    reducers: {
        update: (state, action) => {
            state.notificaciones = action.payload.notificaciones
        },
        setGeneral: (state, action) => {
            state.isGeneral = action.payload
        },
        setGrupo: (state, action) => {
            state.isGrupo = action.payload
        },
        setRoom: (state, action) => {
            state.isRoom = action.payload
        },
    }
});

export const { update, setGeneral, setGrupo, setRoom } = notificationSlice.actions