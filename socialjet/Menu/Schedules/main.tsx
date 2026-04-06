import NewScheduleActionButton from "./Components/NewScheduleActionButton.tsx";
import SchedulesMenuPage from "./Components/SchedulesMenuPage.tsx";
import {Provider} from "react-redux";
import store from "./store.ts";
import ScheduleModal from "./Components/ScheduleModal.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendar} from "@fortawesome/free-regular-svg-icons";

export const MenuItemSchedules = {
    title: "Schedules",
    parent: undefined,
    actions: [
        <NewScheduleActionButton/>
    ],
    icon: <FontAwesomeIcon icon={faCalendar} size={'lg'} />,
    priority: 0,
    slug: "schedules",
    render: () => <Provider store={store}>
        <SchedulesMenuPage/>
        <ScheduleModal/>
    </Provider>
};