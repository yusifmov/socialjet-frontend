import {FC, ReactNode} from "react";
import {AuthModalPropsType} from "./AuthModalPropsType.ts";
import {AccountType} from "./AccountType.ts";
import {PostTemplateType} from "./PostTemplateType.ts";
import {SettingsItemType} from "./SettingsItemType.ts";

export interface AccountProviderType {
    slug: string
    title: string
    description: string
    picture: ReactNode
    getAccountTypeText: (accountOrTypeKey: AccountType | string) => string
    supportsSetting: <T>(account: AccountType, setting: SettingsItemType<T>) => boolean
    getPostTemplates: (account: AccountType) => PostTemplateType[]
    AuthModal: FC<AuthModalPropsType>
}