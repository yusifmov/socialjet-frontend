//todo it would be interesting if settings is not available just for single provider but for an array of providers
import {ReactNode} from "react";

export interface SettingsItemRenderProps<T> {
    value: T | undefined;
    setValue: (value: T) => void;
}

export interface SettingsItemType<T> {
    title: ReactNode;
    slug: string;
    targets: string[];
    provider: string; // same as submenu slug in settings menu
    description: ReactNode;
    priority: number;
    defaultValue: T;
    render: (props: SettingsItemRenderProps<T>) => ReactNode;
}