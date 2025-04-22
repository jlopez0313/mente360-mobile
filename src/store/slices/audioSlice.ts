import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tab: 'clips',
    baseURL: import.meta.env.VITE_BASE_BACK,
    audioSrc: '', // El src del Audio
    isGlobalPlaying: false,
    globalAudio: '',
    listAudios: [] as any[],
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
        setAudioSrc: (state, action) => {
            state.audioSrc = action.payload;
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
        setListAudios: (state, action) => {            
            state.listAudios = [...action.payload];
        },
        setAudioItem: (state, action) => {
            const { index, newData } = action.payload;
            
            state.listAudios = state.listAudios.map((item, i) =>
                i === index ? { ...item, ...newData } : item
            );
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
    setAudioSrc,
    updateCurrentTime,
    setIsGlobalPlaying,
    setGlobalAudio,
    clearListAudios,
    setListAudios,
    setGlobalPos,
    setShowGlobalAudio,
    setAudioItem,
} = audioSlice.actions