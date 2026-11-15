import {useDispatch} from "react-redux";
import {Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {ScheduleDispatch} from "../store.ts";
import {setOpen} from "../Slices/modalSlice.ts";
import {getEmptySchedule, setSchedule} from "../Slices/scheduleSlice.ts";

/** Same look as the Accounts page's "Add account" button. */
function ScheduleButtonContent() {
    const dispatch = useDispatch<ScheduleDispatch>();

    const onClick = () => {
        dispatch(setSchedule(getEmptySchedule()));
        dispatch(setOpen(true));
    };

    return (
        <Button type="primary" icon={<PlusOutlined/>} onClick={onClick}>
            New schedule
        </Button>
    );
}

export default ScheduleButtonContent;
