import MenuItemType from "./Types/MenuItemType";
import {SocialJetType} from "./Types/SocialJetType";
import {SettingsProviderType} from "./Types/SettingsProviderType.ts";
import {MenuType} from "./Types/MenuType.ts";
import {SettingsItemType} from "./Types/SettingsItemType.ts";
import {AccountProviderType} from "./Types/AccountProviderType.ts";
import {PostTagType} from "./Types/PostTagType.ts";

const SOCIALJET_MENU:MenuType[] = [];
const SOCIALJET_MENU_ITEMS:MenuItemType[] = [];
const SOCIALJET_SETTINGS_PROVIDERS: SettingsProviderType[] = [];
const SOCIALJET_SETTINGS_ITEMS: SettingsItemType<any>[] = [];
const SOCIALJET_ACCOUNT_PROVIDERS: AccountProviderType[] = [];
const SOCIALJET_POST_TAGS: PostTagType[] = [];

const socialjet_register_menu_item = (item: MenuItemType) => {
    SOCIALJET_MENU_ITEMS.push(item);
    //todo build menu only when getting menu
    if(!item.parent)
    {
        SOCIALJET_MENU.push({
            item: item, children: []
        });
    }
    else {
        for (const i in SOCIALJET_MENU) {
            if (SOCIALJET_MENU[i].item.slug == item.slug)
            {
                SOCIALJET_MENU[i].children.push(item)
                break;
            }
        }
    }
}

const socialjet_register_setting_provider = (item: SettingsProviderType) => {
    SOCIALJET_SETTINGS_PROVIDERS.push(item);
}

const socialjet_register_account_provider = (item: AccountProviderType) => {
    SOCIALJET_ACCOUNT_PROVIDERS.push(item);
}

const socialjet_register_post_tag = (tag: PostTagType) => {
    SOCIALJET_POST_TAGS.push(tag);
}

const socialjet_register_settings_item = <T> (item: SettingsItemType<T>) => {
    SOCIALJET_SETTINGS_ITEMS.push(item);
}

const socialjet_get_settings_item = <T = any> (key: string) : SettingsItemType<T> => {
    let parent: string | null = null;
    let slug: string | null;
    if(key.includes(':')){
        [parent, slug] = key.split(':');
    }
    else {
        slug = key;
    }

    for (const i in SOCIALJET_SETTINGS_ITEMS){
        if(SOCIALJET_SETTINGS_ITEMS[i].slug == slug && (parent == null || SOCIALJET_SETTINGS_ITEMS[i].provider == parent)){
            return  SOCIALJET_SETTINGS_ITEMS[i];
        }
    }

    throw new Error('Settings item not found.');
}

const socialjet_get_menu_item = (key: string) : MenuItemType => {
    let parent: string | null = null;
    let slug: string | null;
    if(key.includes(':')){
        [parent, slug] = key.split(':');
    }
    else {
        slug = key;
    }

    for (const i in SOCIALJET_MENU_ITEMS){
        if(SOCIALJET_MENU_ITEMS[i].slug == slug && (parent == null || SOCIALJET_MENU_ITEMS[i].parent == parent)){
            return  SOCIALJET_MENU_ITEMS[i];
        }
    }

    throw new Error('Settings item not found.');
}

const socialjet_get_account_provider = (key: string) : AccountProviderType => {
    const provider = SOCIALJET_ACCOUNT_PROVIDERS.find(item => item.slug === key);

    if(provider){
        return provider;
    }

    throw new Error('Account provider not found.');
}

const socialjet_get_settings_provider = (key: string) : SettingsProviderType => {
    const provider = SOCIALJET_SETTINGS_PROVIDERS.find(item => item.slug === key);

    if(provider){
        return provider;
    }

    throw new Error('Settings provider not found.');
}

const socialjet_get_post_tag = (key: string) : PostTagType => {
    const tag = SOCIALJET_POST_TAGS.find(item => item.slug === key);

    if(tag){
        return tag;
    }

    throw new Error('Post tag not found: ' + key);
}

const SocialJet: SocialJetType = {
    getMenu: () => SOCIALJET_MENU,
    getSettingsProviders: () => SOCIALJET_SETTINGS_PROVIDERS,
    getSettingsItems: () => SOCIALJET_SETTINGS_ITEMS,
    getSettingsItem: socialjet_get_settings_item,
    getMenuItem: socialjet_get_menu_item,
    registerSettingsProvider: socialjet_register_setting_provider,
    getSettingsProvider: socialjet_get_settings_provider,
    registerSettingsItem: socialjet_register_settings_item,
    registerMenuItem: socialjet_register_menu_item,
    registerAccountProvider: socialjet_register_account_provider,
    getAccountProviders: () => SOCIALJET_ACCOUNT_PROVIDERS,
    getAccountProvider: socialjet_get_account_provider,
    registerPostTag: socialjet_register_post_tag,
    getPostTags: () => SOCIALJET_POST_TAGS,
    getPostTag: socialjet_get_post_tag
};

(window as any).SocialJet = SocialJet;
export const sj: SocialJetType = window.SocialJet;