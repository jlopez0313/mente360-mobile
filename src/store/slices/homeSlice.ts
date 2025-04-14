import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mensaje: {},
    panico: {},
    tarea: {},
    audio: {},
    currentDay: 0,
    msgSource: ''
}

export const homeSlice = createSlice({
    name: 'HomeSlice',
    initialState: { ...initialState },
    reducers: {
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
        setCurrentDay: (state, action) => {
            state.currentDay = action.payload;
        },
        setMsgSource: (state, action) => {
            state.msgSource = action.payload;
        },
    }
});

export const {
    setAudio,
    setTarea,
    setPanico,
    setMensaje,
    setMsgSource,
    setCurrentDay,
} = homeSlice.actions