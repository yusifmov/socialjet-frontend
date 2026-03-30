import {FC} from "react";
import {Provider} from "react-redux";
import store from "../store.ts";
import ScheduleButtonContent from "./ScheduleButtonContent.tsx";

const NewScheduleActionButton: FC = () => {
    return (
        <Provider store={store}>
            <ScheduleButtonContent/>
        </Provider>
    );
};

export default NewScheduleActionButton;
