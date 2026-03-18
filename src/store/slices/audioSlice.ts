import Clips from "@/database/clips";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tab: 'clips',
    baseURL: import.meta.env.VITE_BASE_BACK,
    audioSrc: '', // El src del Audio
    isGlobalPlaying: false,
    globalAudio: null as Clips | null,
    listAudios: [] as Clips[],
    globalPos: 0,
    showGlobalAudio: true,
    myCurrentTime: 0,
}

export const audioSlice = createSlice({
    name: 'audio',
    initialState: { ...initialState },
    reducers: {
        resetStore: () => {
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
        putGlobalAudio: (state, action) => {
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
    putGlobalAudio,
    clearListAudios,
    setListAudios,
    setGlobalPos,
    setShowGlobalAudio,
    setAudioItem,
} = audioSlice.actions;

// Selectores para optimizar renderizados y evitar re-renders por myCurrentTime
export const selectAudioTab = (state: any) => state.audio.tab;
export const selectBaseURL = (state: any) => state.audio.baseURL;
export const selectAudioSrc = (state: any) => state.audio.audioSrc;
export const selectIsGlobalPlaying = (state: any) => state.audio.isGlobalPlaying;
export const selectGlobalAudio = (state: any) => state.audio.globalAudio;
export const selectListAudios = (state: any) => state.audio.listAudios;
export const selectGlobalPos = (state: any) => state.audio.globalPos;
export const selectShowGlobalAudio = (state: any) => state.audio.showGlobalAudio;
export const selectMyCurrentTime = (state: any) => state.audio.myCurrentTime;