import HistoryMenuPage from "./HistoryMenuPage.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendarCheck} from "@fortawesome/free-regular-svg-icons";

export const MenuItemHistory = {
    title: 'Sharing history',
    slug: 'history',
    icon: <FontAwesomeIcon icon={faCalendarCheck}/>,
    priority: 100,
    actions: [],
    render: () => <HistoryMenuPage/>,
};