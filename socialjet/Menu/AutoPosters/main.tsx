import {Provider} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBolt} from "@fortawesome/free-solid-svg-icons";
import store from "./store.ts";
import NewAutoPosterActionButton from "./Components/NewAutoPosterActionButton.tsx";
import AutoPostersMenuPage from "./Components/AutoPostersMenuPage.tsx";
import AutoPosterModal from "./Components/AutoPosterModal.tsx";

export const MenuItemAutoPosters = {
    title: "Auto-posters",
    parent: undefined,
    actions: [
        <NewAutoPosterActionButton/>
    ],
    icon: <FontAwesomeIcon icon={faBolt} size={'lg'}/>,
    priority: 0,
    slug: "autoposters",
    render: () => <Provider store={store}>
        <AutoPostersMenuPage/>
        <AutoPosterModal/>
    </Provider>
};
