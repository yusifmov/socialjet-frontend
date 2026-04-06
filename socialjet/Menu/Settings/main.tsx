import Settings from './Settings.tsx';
import { Provider } from 'react-redux';
import { store } from './store.ts';
import {SettingOutlined} from "@ant-design/icons";

export const MenuItemSettings = {
    title: 'Settings',
    slug: 'settings',
    priority: 100,
    actions: [],
    icon: <SettingOutlined/>,
    render: () => (
        <Provider store={store}>
            <Settings />
        </Provider>
    ),
};