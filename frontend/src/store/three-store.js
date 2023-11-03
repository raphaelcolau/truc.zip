import { createSlice, configureStore } from '@reduxjs/toolkit';

const threeSlice = createSlice({
    name: 'three',
    initialState: {
        isSpeedUp: false,
    },
    reducers: {
        setIsSpeedUp: (state, action) => {
            state.isSpeedUp = action.payload;
        },
    },
});

export const { setIsSpeedUp } = threeSlice.actions;

export const threeStore = configureStore({
    reducer: threeSlice.reducer,
});