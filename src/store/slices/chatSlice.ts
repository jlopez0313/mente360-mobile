import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        tab: 'chat',
    },
    reducers: {
        setTab: (state, action) => {
            state.tab = action.payload
        },
    }
});

export const { setTab } = chatSlice.actions