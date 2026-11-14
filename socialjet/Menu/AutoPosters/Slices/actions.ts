import {AutoPosterDispatch} from "../store.ts";
import {getEmptySchedule, setSchedule} from "../../Schedules/Slices/scheduleSlice.ts";
import {setOpen} from "../../Schedules/Slices/modalSlice.ts";
import {setFilters} from "./filtersSlice.ts";
import {AutoPosterType} from "../Types/AutoPosterType.ts";

/** Opens the editor for an existing auto-poster, or an empty one. */
export function openAutoPosterEditor(dispatch: AutoPosterDispatch, autoPoster?: AutoPosterType) {
    const empty = getEmptySchedule();

    dispatch(setSchedule(autoPoster ? {
        id: autoPoster.id,
        type: 'autoposter',
        accountSettings: autoPoster.accountSettings,
        posts: [],
        scheduleSettings: {...empty.scheduleSettings, ...autoPoster.scheduleSettings},
        status: autoPoster.status,
    } : {
        ...empty,
        type: 'autoposter',
        // Share as soon as a post is published.
        scheduleSettings: {...empty.scheduleSettings, sharing_gap: 0},
    }));
    dispatch(setFilters(autoPoster?.filters));
    dispatch(setOpen(true));
}

export function closeAutoPosterEditor(dispatch: AutoPosterDispatch) {
    dispatch(setOpen(false));
    dispatch(setSchedule({...getEmptySchedule(), type: 'autoposter'}));
    dispatch(setFilters(null));
}
