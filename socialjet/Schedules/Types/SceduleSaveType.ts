import ScheduleSettingsType from "./ScheduleSettingsType";

export interface ScheduleSaveType {
    id?: number;
    type: string;
    accountSettings: {account_id: number, settings: object}[];
    posts: number[];
    scheduleSettings: ScheduleSettingsType;
    time_offset: number;
}