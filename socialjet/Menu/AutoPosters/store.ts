import {configureStore} from '@reduxjs/toolkit';
import modalSlice from "../Schedules/Slices/modalSlice.ts";
import scheduleSlice from "../Schedules/Slices/scheduleSlice.ts";
import filtersSlice from "./Slices/filtersSlice.ts";

/**
 * Its own store, with the same `schedule` and `modal` slices as the Schedules page,
 * so the shared steps (accounts, timing) work here unchanged.
 */
const store = configureStore({
    reducer: {
        schedule: scheduleSlice,
        modal: modalSlice,
        filters: filtersSlice,
    }
});

export type AutoPosterState = ReturnType<typeof store.getState>;
export type AutoPosterDispatch = typeof store.dispatch;
export default store;
