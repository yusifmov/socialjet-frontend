import {useDispatch, useSelector} from 'react-redux';
import {ScheduleDispatch, ScheduleState} from "../store.ts";
import {setOpen} from "../Slices/modalSlice.ts";
import AccountSettingType from "../Types/AccountSettingType.ts";
import {removeAccountSetting, setAccountSettings} from "../Slices/scheduleSlice.ts";

function useScheduleModal(){

    const accountSelector = useSelector((state: ScheduleState) => state.schedule.accountSettings);
    const modalSelector  = useSelector((state: ScheduleState) => state.modal);
    const dispatch = useDispatch<ScheduleDispatch>();

    //need to create set open right here using dispatch

    return {
        setOpen: (open: boolean) => dispatch(setOpen(open)),
        open: modalSelector.open,
        setAccountSettings: (accountSettings: AccountSettingType[]) => dispatch(setAccountSettings(accountSettings)),
        accountSettings: accountSelector,
        removeAccountSetting: (accountSetting: AccountSettingType) => dispatch(removeAccountSetting(accountSetting)),

    }
}

export default useScheduleModal;

