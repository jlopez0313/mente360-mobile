import { configureStore } from '@reduxjs/toolkit'
import { audioSlice } from './slices/audioSlice'
import { chatSlice } from './slices/chatSlice'
import { homeSlice } from './slices/homeSlice'
import { notificationSlice } from './slices/notificationSlice'
import { routeSlice } from './slices/routeSlice'
import { userSlice } from './slices/userSlice'

export const store = configureStore({
    reducer: {
        audio: audioSlice.reducer,
        notifications: notificationSlice.reducer,
        chat: chatSlice.reducer,
        route: routeSlice.reducer,
        home: homeSlice.reducer,
        user: userSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
    }),
})