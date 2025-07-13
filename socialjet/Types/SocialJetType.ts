import {MenuType} from "./MenuType";
import {SettingsProviderType} from "./SettingsProviderType.ts";
import {SettingsItemType} from "./SettingsItemType.ts";
import MenuItemType from "./MenuItemType.ts";
import {AccountProviderType} from "./AccountProviderType.ts";
import {PostTagType} from "./PostTagType.ts";

export interface SocialJetType {
    registerSettingsItem: <T>(settingsItem: SettingsItemType<T>) => void,
    registerMenuItem: (menuItem: MenuItemType) => void,
    registerSettingsProvider: (settingsProvider: SettingsProviderType) => void,
    getMenu: () => MenuType[],
    getSettingsProviders: () => SettingsProviderType[],
    getSettingsProvider: (key: string) => SettingsProviderType,
    getSettingsItems: <T>() => SettingsItemType<T>[],
    getSettingsItem: <T>(key: string) => SettingsItemType<T>,
    getMenuItem: (key: string) => MenuItemType,
    registerAccountProvider: (accountProvider: AccountProviderType) => void,
    getAccountProviders: () => AccountProviderType[],
    getAccountProvider: (key: string) => AccountProviderType,
    registerPostTag: (postTag: PostTagType) => void,
    getPostTags: () => PostTagType[],
    getPostTag: (key: string) => PostTagType,
}