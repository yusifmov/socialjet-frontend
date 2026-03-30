import {useDispatch} from "react-redux";
import {ScheduleDispatch} from "../store.ts";
import {Button} from "antd";
import {setOpen} from "../Slices/modalSlice.ts";

function ScheduleButtonContent(){
    const dispatch = useDispatch<ScheduleDispatch>();

    const onClick = () => {
        dispatch(setOpen(true));
    }

    return <>
        <Button onClick={onClick}>New Schedule</Button>
    </>
}

export default ScheduleButtonContent;