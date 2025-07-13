import {sj} from "../SocialJet.ts";
import NewScheduleActionButton from "./Components/NewScheduleActionButton.tsx";
import SchedulesMenuPage from "./Components/SchedulesMenuPage";
import {Provider} from "react-redux";
import store from "./store";
import ScheduleModal from "./Components/ScheduleModal.tsx";

sj.registerMenuItem({
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
})