import Settings from './Settings';
import { Provider } from 'react-redux';
import { store } from './store';
import {sj} from "../SocialJet";

sj.registerMenuItem({
    title: 'Settings',
    slug: 'settings',
    priority: 100,
    actions: [],
    render: () => (
        <Provider store={store}>
            <Settings />
        </Provider>
    ),
});