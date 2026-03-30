import Settings from './Settings.tsx';
import { Provider } from 'react-redux';
import { store } from './store.ts';

export const MenuItemSettings = {
    title: 'Settings',
    slug: 'settings',
    priority: 100,
    actions: [],
    render: () => (
        <Provider store={store}>
            <Settings />
        </Provider>
    ),
};