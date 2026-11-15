import { createRoot } from 'react-dom/client'
import Menu from "./Menu";
import {App, ConfigProvider} from "antd";
import {StyleProvider} from "@ant-design/cssinjs";
import {socialJetTheme} from "./theme.ts";

createRoot(document.getElementById('socialjet')!).render(
    // hashPriority="high" drops Ant Design's default `:where()` wrapper so its
    // selectors carry real specificity instead of 0 — otherwise WordPress admin
    // styles (forms.css etc.) win. cssVar exposes the design tokens as CSS
    // variables so style.css can re-assert the antd look on form controls.
    <StyleProvider hashPriority="high">
        <ConfigProvider theme={socialJetTheme}>
            <App style={{
                height: '100%'
            }}>
                <Menu/>
            </App>
        </ConfigProvider>
    </StyleProvider>
)
