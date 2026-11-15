import AccountSettingType from "../../Schedules/Types/AccountSettingType.ts";
import ScheduledPostType from "../../Schedules/Types/ScheduledPostType.ts";
import ScheduleSettingsType from "../../Schedules/Types/ScheduleSettingsType.ts";
import {AutoPostFilters} from "./AutoPostFilters.ts";

/** As returned by `socialjet/autoposters/get` and `list`. */
export interface AutoPosterType {
    id: number;
    type: 'autoposter';
    filters: AutoPostFilters | null;
    scheduleSettings: ScheduleSettingsType;
    accountSettings: AccountSettingType[];
    /** The 20 most recent matched posts. */
    posts: ScheduledPostType[];
    stats: {
        matched: number;
        pending: number;
        last_shared_at: number | null;
    };
    status: 'active' | 'paused';
}

export interface AutoPosterSaveType {
    id?: number;
    filters: AutoPostFilters;
    scheduleSettings: Pick<ScheduleSettingsType, 'title' | 'is_planned' | 'sharing_gap' | 'plan'>;
    accountSettings: { account_id: number, settings: object }[];
    time_offset: number;
}
