import {FC, ReactNode} from "react";

export interface PostTagType {
    slug: string;
    title: ReactNode;
    description: ReactNode;
    icon?: ReactNode;
    settingsView?: FC<{params: Record<string, string>, setParams: (params: Record<string, string>) => void}>;
    defaultParams: {
        type: string,
        [key: string]: string;
    };
 }