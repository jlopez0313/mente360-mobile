import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    admin: {},
    mensaje: {},
    panico: {},
    tarea: {},
    audio: {},
    podcast: {},
    cadenaDelBien: {},
    tarjetaDestacada: {},
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
        setPanico: (state, action) => {
            state.panico = {...action.payload};
        },
        setPodcast: (state, action) => {
            state.podcast = {...action.payload};
        },
        setCadenaDelBien: (state, action) => {
            state.cadenaDelBien = {...action.payload};
        },
        setTarjetaDestacada: (state, action) => {
            state.tarjetaDestacada = {...action.payload};
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
    setPanico,
    setPodcast,
    setCadenaDelBien,
    setTarjetaDestacada,
    setMsgSource,
    setCurrentDay,
} = homeSlice.actions