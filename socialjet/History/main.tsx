import {sj} from "../SocialJet.ts";
import HistoryMenuPage from "./HistoryMenuPage.tsx";

sj.registerMenuItem({
    title: 'Sharing history',
    slug: 'history',
    priority: 100,
    actions: [],
    render: () => <HistoryMenuPage/>,
});