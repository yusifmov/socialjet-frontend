import {AccountType} from "../../Types/AccountType.ts";
import ScheduledPostType from "../../Schedules/Types/ScheduledPostType.ts";

export interface HistoryItemType {
    id: number;
    account?: AccountType;
    schedule?: {
        id: number;
        title: string;
        type: string;
    };
    post?: ScheduledPostType;
    shared_at?: number;
    status: string; //Fail, Success, Queued, Sharing, Processing
}