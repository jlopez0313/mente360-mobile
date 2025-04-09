import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mensaje: {},
    tarea: {},
    audio: {},
    currentDay: 0,
}

export const homeSlice = createSlice({
    name: 'HomeSlice',
    initialState: { ...initialState },
    reducers: {
        setAudio: (state, action) => {
            state.audio = {...action.payload};
        },
        setMensaje: (state, action) => {
            state.mensaje = {...action.payload};
        },
        setTarea: (state, action) => {
            state.tarea = {...action.payload};
        },
        setCurrentDay: (state, action) => {
            state.currentDay = action.payload;
        },
    }
});

export const {
    setAudio,
    setMensaje,
    setTarea,
    setCurrentDay,
} = homeSlice.actions