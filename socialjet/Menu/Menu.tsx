import React, {useEffect, useMemo, useState} from 'react';
import {Breadcrumb, Flex, Layout, Menu, Typography, theme} from 'antd';
import type {MenuProps} from 'antd';
import {ErrorBoundary, type MenuItemType, type MenuType} from "@socialjet/sdk";
import {sj} from "../SocialJet.ts";
import Logo from "./Logo.tsx";
import {brand} from "./theme.ts";

const {Content, Sider} = Layout;

type ItemType = NonNullable<MenuProps['items']>[number];

/** Menu key of an item: `slug`, or `parent:slug` for submenu entries. */
const keyOf = (item: MenuItemType) => item.parent ? `${item.parent}:${item.slug}` : item.slug;

function toMenuItems(menu: MenuType[]): ItemType[] {
    return menu.map(({item, children}) => ({
        key: keyOf(item),
        label: item.title,
        icon: item.icon,
        children: children.length > 0
            ? children.map(child => ({key: keyOf(child), label: child.title, icon: child.icon}))
            : undefined,
    }));
}

/** The page lives in the URL hash (`#/schedules`), so reloads and the back button keep it. */
const keyFromHash = () => decodeURIComponent(window.location.hash.replace(/^#\/?/, ''));

/** First page that renders something: a top-level item with `render`, else its first child. */
function defaultKey(menu: MenuType[]): string | undefined {
    for (const {item, children} of menu) {
        if (item.render) return keyOf(item);
        const child = children.find(c => c.render);
        if (child) return keyOf(child);
    }
    return undefined;
}

const App: React.FC = () => {
    const {token: {colorBgContainer, borderRadiusLG, colorBorderSecondary}} = theme.useToken();

    // Every add-on has registered by the time this module renders (it loads last).
    const menu = useMemo(() => sj.getMenu(), []);
    const items = useMemo(() => toMenuItems(menu), [menu]);

    const [selectedKey, setSelectedKey] = useState<string | undefined>(() => {
        const fromHash = keyFromHash();
        return fromHash && sj.getMenuItem(fromHash) ? fromHash : defaultKey(menu);
    });

    useEffect(() => {
        const onHashChange = () => {
            const key = keyFromHash();
            if (key && sj.getMenuItem(key)) setSelectedKey(key);
        };
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    const select = (key: string) => {
        setSelectedKey(key);
        // replaceState-free hash update keeps WordPress's ?page=socialjet intact.
        window.location.hash = `/${key}`;
    };

    const selectedItem = selectedKey ? sj.getMenuItem(selectedKey) : null;
    const parentItem = selectedItem?.parent ? sj.getMenuItem(selectedItem.parent) : null;
    const PageView = selectedItem?.render;

    // The app fills the WP admin viewport exactly: the sidebar stays put and only
    // the page area scrolls, so the browser window never gets an outer scrollbar.
    return (
        <Layout style={{height: '100%', overflow: 'hidden'}}>
            <Sider width={232} style={{
                height: '100%',
                overflowY: 'auto',
                scrollbarWidth: 'thin',
                borderRight: `1px solid ${colorBorderSecondary}`,
            }}>
                <Flex align="center" gap={10} style={{height: 68, padding: '0 22px'}}>
                    <Logo size={30}/>
                    <Typography.Text strong style={{fontSize: 17, color: brand.navy, letterSpacing: 0.2}}>SocialJet</Typography.Text>
                </Flex>
                <Menu
                    mode="inline"
                    selectedKeys={selectedKey ? [selectedKey] : []}
                    defaultOpenKeys={selectedItem?.parent ? [selectedItem.parent] : []}
                    style={{borderInlineEnd: 0, background: 'transparent', fontWeight: 500}}
                    items={items}
                    onClick={e => select(e.key)}
                />
            </Sider>
            <Layout style={{padding: '0 24px 24px', height: '100%', overflowY: 'auto'}}>
                <Flex align="center" justify="space-between" style={{minHeight: 64}}>
                    <Breadcrumb items={[
                        {title: 'SocialJet'},
                        ...(parentItem ? [{title: parentItem.title}] : []),
                        ...(selectedItem ? [{title: selectedItem.title}] : []),
                    ]}/>
                    {selectedItem && selectedItem.actions.length > 0 && (
                        <Flex gap={8}>
                            {selectedItem.actions.map((action, i) => <React.Fragment key={i}>{action}</React.Fragment>)}
                        </Flex>
                    )}
                </Flex>

                <Content style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                    flex: 'none',
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}>
                    <ErrorBoundary resetKey={selectedKey}>
                        {PageView
                            ? <PageView/>
                            : <Typography.Text type="secondary">Pick a section in the menu.</Typography.Text>}
                    </ErrorBoundary>
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;
