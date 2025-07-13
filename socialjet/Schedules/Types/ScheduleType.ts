import AccountSettingType from "./AccountSettingType.ts";
import ScheduledPostType from "./ScheduledPostType.ts";
import ScheduleSettingsType from "./ScheduleSettingsType";

export interface ScheduleType {
    id?: number;
    type: string;
    accountSettings: AccountSettingType[];
    posts: ScheduledPostType[];
    scheduleSettings: ScheduleSettingsType;
    status?: 'active' | 'paused' | 'done';
}