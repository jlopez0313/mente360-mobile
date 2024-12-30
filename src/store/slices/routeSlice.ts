import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    route: '/home',
}

export const routeSlice = createSlice({
    name: 'route',
    initialState: { ...initialState },
    reducers: {
        setRoute: (state, action) => {
            state.route = action.payload;
        },
    }
});

export const {
    setRoute,
} = routeSlice.actions