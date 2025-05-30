import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    admin: {},
    mensaje: {},
    panico: {},
    tarea: {},
    audio: {},
    podcast: {},
    currentDay: 0,
    msgSource: ''
}

export const homeSlice = createSlice({
    name: 'HomeSlice',
    initialState: { ...initialState },
    reducers: {
        setAdmin: (state, action) => {
            state.admin = {...action.payload};
        },
        setAudio: (state, action) => {
            state.audio = {...action.payload};
        },
        setPanico: (state, action) => {
            state.panico = {...action.payload};
        },
        setMensaje: (state, action) => {
            state.mensaje = {...action.payload};
        },
        setTarea: (state, action) => {
            state.tarea = {...action.payload};
        },
        setPodcast: (state, action) => {
            state.podcast = {...action.payload};
        },
        setCurrentDay: (state, action) => {
            state.currentDay = action.payload;
        },
        setMsgSource: (state, action) => {
            state.msgSource = action.payload;
        },
    }
});

export const {
    setAdmin,
    setAudio,
    setTarea,
    setPanico,
    setMensaje,
    setPodcast,
    setMsgSource,
    setCurrentDay,
} = homeSlice.actions