import { configureStore } from '@reduxjs/toolkit'
import { notificationSlice } from './slices/notificationSlice'
import { audioSlice } from './slices/audioSlice'
import { chatSlice } from './slices/chatSlice'
import { routeSlice } from './slices/routeSlice'
import { homeSlice } from './slices/homeSlice'

export const store = configureStore({
    reducer: {
        audio: audioSlice.reducer,
        notifications: notificationSlice.reducer,
        chat: chatSlice.reducer,
        route: routeSlice.reducer,
        home: homeSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
    }),
})