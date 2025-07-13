import {WeekDaysEnum} from "./WeekDaysEnum";

export default interface ScheduleSettingsType {
    title: string;
    start_at: number;
    is_planned: boolean;
    sharing_gap: number;
    plan: Partial<{ [key in WeekDaysEnum]: string[] }>,
    post_sort: 'old_to_new' | 'new_to_old' | 'scramble'
}