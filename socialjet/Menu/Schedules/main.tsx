import NewScheduleActionButton from "./Components/NewScheduleActionButton.tsx";
import SchedulesMenuPage from "./Components/SchedulesMenuPage.tsx";
import {Provider} from "react-redux";
import store from "./store.ts";
import ScheduleModal from "./Components/ScheduleModal.tsx";

export const MenuItemSchedules = {
    title: "Schedules",
    parent: undefined,
    actions: [
        <NewScheduleActionButton/>
    ],
    icon: undefined,
    priority: 0,
    slug: "schedules",
    render: () => <Provider store={store}>
        <SchedulesMenuPage/>
        <ScheduleModal/>
    </Provider>
};