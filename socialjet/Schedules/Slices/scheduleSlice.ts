import dayjs from "dayjs";
import {ScheduleType} from "../Types/ScheduleType.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import ScheduledPostType from "../Types/ScheduledPostType.ts";
import ScheduleSettingsType from "../Types/ScheduleSettingsType.ts";
import AccountSettingType from "../Types/AccountSettingType.ts";
import {AccountType} from "../../Types/AccountType.ts";
import {sj} from "../../SocialJet.ts";

function pushAccountSettingLogic(state: AccountSettingType[], accountSetting: AccountSettingType | AccountType): AccountSettingType[] {
    if ('account' in accountSetting) {
        const found = state.find(s => s.account.id === accountSetting.account.id);

        if (!found) {
            state.push(accountSetting);
        }
    } else {
        const found = state.find(s => s.account.id === accountSetting.id);

        if (!found) {
            const settingsItems = sj.getSettingsItems();
            const settings: Record<string, any> = {};
            for (const item of settingsItems) {
                if (
                    sj.getAccountProvider(accountSetting.provider)?.supportsSetting(accountSetting, item)
                    &&
                    item.targets.includes('schedule')
                ) {
                    settings[item.provider + ':' + item.slug] = item.defaultValue;
                }
            }
            state.push({
                account: accountSetting,
                settings: settings,
            })
        }
    }

    return state;
}

export function getEmptySchedule() : ScheduleType{
    return {
        id: undefined,
        type: 'schedule',
        scheduleSettings: {
            title: "",
            start_at: dayjs().unix(),
            is_planned: false,
            sharing_gap: 1,
            plan: {},
            post_sort: "old_to_new",
        },
        posts: [],
        accountSettings: [],
    }
}

const scheduleSlice = createSlice({
    name: 'schedule',
    initialState: getEmptySchedule(),
    reducers: {
        setSchedule: (_, action: PayloadAction<ScheduleType>) => {
            return action.payload
        },
        setId: (state, action: PayloadAction<number | undefined>) => {
            state.id = action.payload
        },

        //schedule settings
        setSettings: (state, action: PayloadAction<ScheduleSettingsType>) => {
            state.scheduleSettings = action.payload
        },
        resetSettings: (state) => {
            state.scheduleSettings = getEmptySchedule().scheduleSettings
        },

        //posts
        setPosts: (state, action:{payload: ScheduledPostType[], type:string}) => {
            state.posts = action.payload;
        },
        pushPost: (state, action:{payload: ScheduledPostType, type:string}) => {
            const found = state.posts.find(v => v.id === action.payload.id);

            if(!found){
                state.posts.push(action.payload);
            }
        },
        removePost: (state, action:{payload: ScheduledPostType, type:string}) => {
            state.posts = state.posts.filter(v => v.id !== action.payload.id);
        },

        //accounts
        setAccountSettings: (state, action: { payload: AccountSettingType[]; type: string }) => {
            let newState: AccountSettingType[] = [];
            for (const setting of action.payload) {
                newState = pushAccountSettingLogic(newState, setting);
            }
            state.accountSettings = newState;
        },
        removeAccountSetting: (state, action: { payload: AccountSettingType; type: string }) => {
            state.accountSettings = state.accountSettings.filter(v => v.account.id !== action.payload.account.id);
        },
        pushAccountSetting: (state, action: { payload: AccountSettingType | AccountType; type: string }) => {
            state.accountSettings = pushAccountSettingLogic(state.accountSettings, action.payload);
        },
        updateAccountSetting: (state, action: {
            payload: { account_id: number, value: any, setting_key: string };
            type: string
        }) => {
            let i = state.accountSettings.findIndex(as => as.account.id === action.payload.account_id);

            if (i > -1) {
                //todo update single setting
                state.accountSettings[i].settings = {
                    ...state.accountSettings[i].settings,
                    [action.payload.setting_key]: action.payload.value
                };
            }
        }
    }
});

export const {setSchedule, setId, setSettings, resetSettings, setPosts, pushPost, removePost, setAccountSettings, removeAccountSetting, pushAccountSetting, updateAccountSetting} = scheduleSlice.actions;
export default scheduleSlice.reducer;