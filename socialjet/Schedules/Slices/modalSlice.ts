import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import ScheduleModalType from "../Types/ScheduleModalType.ts";

const initialState: ScheduleModalType = {
    open: false,
    steps: [],
    current: undefined //string or undefined
}

const modalSlice = createSlice({
    name: 'schedule_modal',
    initialState: initialState,
    reducers: {
        setSteps: (_state, action: PayloadAction<ScheduleModalType>) =>{
            return action.payload;
        },
        setOpen: (state, action: PayloadAction<boolean>) =>{
            state.open = action.payload;
        },
        setCurrent: (state, action: PayloadAction<string|undefined>) =>{
            state.current = action.payload;
        }
    },

})

export const {setSteps, setOpen, setCurrent} = modalSlice.actions;
export default modalSlice.reducer;