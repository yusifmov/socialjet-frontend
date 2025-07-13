import {ReactNode} from "react";

export interface ScheduleModalStepType {
    slug: string;
    title: string;
    content: ReactNode;
    place_after?: string
}