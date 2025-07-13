import { configureStore } from '@reduxjs/toolkit'
import modalSlice from "./Slices/modalSlice.ts";
import scheduleSlice from "./Slices/scheduleSlice.ts";

const store = configureStore({
    reducer: {
        schedule: scheduleSlice,
        modal: modalSlice,
    }
})

export type ScheduleState = ReturnType<typeof store.getState>;
export type ScheduleDispatch = typeof store.dispatch;
export default store;