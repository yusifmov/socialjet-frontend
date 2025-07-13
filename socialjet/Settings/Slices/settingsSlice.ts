import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: Record<string, any> = {};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setSetting: (state, action: PayloadAction<{ key: string; value: any }>) => {
            state[action.payload.key] = action.payload.value;
        },
        setInitialSettings: (state, action: PayloadAction<Record<string, any>>) => {
            Object.assign(state, action.payload);
        }
    },
});

export const { setSetting, setInitialSettings } = settingsSlice.actions;
export default settingsSlice.reducer;