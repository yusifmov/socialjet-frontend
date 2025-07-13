import {ReactNode} from "react";

export interface SettingsProviderType {
    title: ReactNode,
    description: ReactNode,
    icon: ReactNode,
    priority: number,
    slug: string,
}