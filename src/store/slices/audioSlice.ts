import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tab: 'clips',
    baseURL: import.meta.env.VITE_BASE_BACK,
    audio: '',
    isGlobalPlaying: false,
    globalAudio: '',
    listAudios: [],
    globalPos: 0,
    showGlobalAudio: true,
    myCurrentTime: 0,
}

export const audioSlice = createSlice({
    name: 'audio',
    initialState: { ...initialState },
    reducers: {
        resetStore: (state) => {
            return { ...initialState };
        },
        setTab: (state, action) => {
            state.tab = action.payload;
        },
        setAudioRef: (state, action) => {
            state.audio = state.baseURL + action.payload;
        },
        updateCurrentTime: (state, action) => {
            state.myCurrentTime = action.payload;
        },
        setIsGlobalPlaying: (state, action) => {
            state.isGlobalPlaying = action.payload;
        },
        setGlobalAudio: (state, action) => {
            state.myCurrentTime = 0;
            state.globalAudio = action.payload;
        },
        clearListAudios: (state) => {
            state.listAudios = [];
        },
        addListAudios: (state, action) => {
            state.listAudios = [...state.listAudios, ...action.payload];
        },
        setListAudios: (state, action) => {
            state.listAudios = [...action.payload];
        },
        setGlobalPos: (state, action) => {
            state.myCurrentTime = 0;
            state.globalPos = action.payload;
        },
        setShowGlobalAudio: (state, action) => {
            state.showGlobalAudio = action.payload;
        },
    }
});

export const {
    resetStore,
    setTab,
    setAudioRef,
    updateCurrentTime,
    setIsGlobalPlaying,
    setGlobalAudio,
    clearListAudios,
    addListAudios,
    setListAudios,
    setGlobalPos,
    setShowGlobalAudio
} = audioSlice.actions