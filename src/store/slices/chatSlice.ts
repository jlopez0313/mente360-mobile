import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        activeTab: 'chats',
    },
    reducers: {
        setTab: (state, action) => {
            state.activeTab = action.payload
        },
    }
});

export const { setTab } = chatSlice.actions