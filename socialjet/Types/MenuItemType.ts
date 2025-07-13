import {FC, ReactNode} from "react";

interface MenuItemType {
    title: ReactNode,
    slug: string,
    priority: number,
    icon?: ReactNode
    parent?: string,
    render?: FC,
    actions: ReactNode[]
}

export default MenuItemType;