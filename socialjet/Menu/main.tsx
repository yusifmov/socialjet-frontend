import { createRoot } from 'react-dom/client'
import Menu from "./Menu";
import {App, ConfigProvider} from "antd";

createRoot(document.getElementById('socialjet')!).render(
    <ConfigProvider
        theme={{
            components: {
                Message: {
                    zIndexPopupBase: 100000,
                    zIndexBase: 100000,
                    zIndexPopup: 100000,
                },
            },
        }}
    >
        <App style={{
            height: '100%'
        }}>
            <Menu/>
        </App>
    </ConfigProvider>
)
