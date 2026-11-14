import type {ThemeConfig} from "antd";

/**
 * Brand palette, taken from the plugin's logo.svg: a deep-navy → indigo badge,
 * indigo broadcast waves and a yellow → orange → rose flame.
 */
export const brand = {
    navy: '#1b1850',
    navyLight: '#2a2470',
    indigo: '#4f46e5',
    indigoDeep: '#3a2f99',
    indigoSoft: '#818cf8',
    indigoPale: '#eef0ff',
    flame: '#fb923c',
    flameDeep: '#f43f5e',
    /** Gradient used on primary calls to action (matches the logo badge). */
    gradient: 'linear-gradient(135deg, #3a2f99 0%, #4f46e5 55%, #6366f1 100%)',
    flameGradient: 'linear-gradient(135deg, #fde047 0%, #fb923c 50%, #f43f5e 100%)',
} as const;

export const socialJetTheme: ThemeConfig = {
    cssVar: true,
    token: {
        colorPrimary: brand.indigo,
        colorInfo: brand.indigo,
        colorLink: brand.indigo,
        colorWarning: brand.flame,
        colorError: brand.flameDeep,
        borderRadius: 8,
        borderRadiusLG: 12,
        colorBgLayout: '#f5f6fb',
    },
    components: {
        Layout: {
            siderBg: '#ffffff',
            bodyBg: '#f5f6fb',
        },
        Menu: {
            itemBg: 'transparent',
            itemColor: '#4b5068',
            itemHoverBg: '#f1f2fa',
            itemHoverColor: brand.navy,
            itemSelectedBg: brand.indigoPale,
            itemSelectedColor: brand.indigo,
            subMenuItemBg: 'transparent',
            itemBorderRadius: 8,
            itemMarginInline: 12,
            itemHeight: 40,
            iconSize: 15,
            activeBarBorderWidth: 0,
        },
        Steps: {
            iconSize: 28,
        },
        Message: {
            zIndexPopupBase: 100000,
            zIndexBase: 100000,
            zIndexPopup: 100000,
        },
    },
};
