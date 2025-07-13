import React, {useState} from 'react';
import {Breadcrumb, Flex, Layout, Menu, theme} from 'antd';
import {sj} from "../SocialJet.ts";
import {MenuType} from "../Types/MenuType.ts";
import {ItemType} from "antd/es/menu/interface";
import MenuItemType from "../Types/MenuItemType.ts";

const { Header, Content, Sider } = Layout;

function mapMenuTypeToItemType(menuTypes: MenuType[]): ItemType[] {
    return menuTypes.map(menu => {
        const { item, children } = menu;

        const mappedItem: ItemType = {
            key: item.slug,
            label: item.title,
            icon: item.icon,
            children: children.length > 0 ?  children.map(child => ({
                key: item.slug + ':' +child.slug,
                label: child.title,
                icon: child.icon,
            })) : undefined
        };

        return mappedItem;
    });
}

// Usage example
const myVar: MenuType[] = sj.getMenu();

const mappedItems: ItemType[] = mapMenuTypeToItemType(myVar);

const App: React.FC = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);

    const handleClick = (e: { key: string }) => {
        setSelectedItem(sj.getMenuItem(e.key));
    };

    return (
        <Layout style={{ minHeight: '100%', boxSizing: 'border-box' }}>
            <Layout>
                <Sider width={280} style={{ background: colorBgContainer, overflowY: 'auto', scrollbarWidth: 'thin' }}>
                    <Header style={{ backgroundColor:"transparent", display: 'flex', alignItems: 'center' }}>
                        <div>SocialJet</div>
                    </Header>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{ borderRight: 0 }}
                        items={mappedItems}
                        onClick={handleClick}
                    />
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Flex style={{alignItems: 'center', justifyContent: 'space-between'}}>
                        <Breadcrumb
                            items={selectedItem
                                ? (selectedItem.parent
                                    ? [{ title: 'SocialJet' }, { title: sj.getMenuItem(selectedItem.parent).title }, { title: selectedItem.title }]
                                    :[{ title: 'SocialJet' }, { title: selectedItem.title }])
                                : [{ title: 'SocialJet' }]}
                            style={{ margin: '16px 0' }}
                        />

                        {selectedItem && selectedItem.actions.length > 0 && <Flex gap={"8px"}>
                            {selectedItem.actions.map((action) => action)}
                        </Flex>}
                    </Flex>

                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {selectedItem?.render? <selectedItem.render/> : 'Click on the menu'}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default App;