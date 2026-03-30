import {ScheduleModalStepType} from "./ScheduleModalStepType.ts";

export default interface ScheduleModalType {
    open: boolean,
    steps: ScheduleModalStepType[],
    current?: string
}