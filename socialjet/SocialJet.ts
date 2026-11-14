import MenuItemType from "./Types/MenuItemType";
import {SocialJetType} from "./Types/SocialJetType";
import {SettingsProviderType} from "./Types/SettingsProviderType.ts";
import {MenuType} from "./Types/MenuType.ts";
import {SettingsItemType} from "./Types/SettingsItemType.ts";
import {AccountProviderType} from "./Types/AccountProviderType.ts";
import {PostTagType} from "./Types/PostTagType.ts";

const SOCIALJET_MENU_ITEMS: MenuItemType[] = [];
const SOCIALJET_SETTINGS_PROVIDERS: SettingsProviderType[] = [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- items of any value type share one registry
const SOCIALJET_SETTINGS_ITEMS: Record<string, SettingsItemType<any>> = {};
const SOCIALJET_ACCOUNT_PROVIDERS: AccountProviderType[] = [];
const SOCIALJET_POST_TAGS: PostTagType[] = [];

/** Lower priority first; ties keep registration order (Array.prototype.sort is stable). */
const byPriority = <T extends { priority?: number }>(items: T[]): T[] =>
    [...items].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));

/** Registering the same key twice replaces the earlier entry instead of duplicating it. */
const upsert = <T extends { slug: string }>(list: T[], item: T, sameAs: (a: T) => boolean = a => a.slug === item.slug) => {
    const i = list.findIndex(sameAs);
    if (i > -1) {
        list[i] = item;
    } else {
        list.push(item);
    }
};

/** The `"<provider>:<slug>"` key settings are stored under (must match the PHP side). */
export const settingKey = (item: { provider: string, slug: string }) => `${item.provider}:${item.slug}`;

const warnMissing = (what: string, key: string) => console.warn(`[SocialJet] ${what} not found: ${key}`);

const SocialJet: SocialJetType = {
    getMenu: (): MenuType[] => {
        const items = byPriority(SOCIALJET_MENU_ITEMS);
        return items
            .filter(item => !item.parent)
            .map(item => ({item, children: items.filter(child => child.parent === item.slug)}));
    },
    getMenuItem: (key) => {
        const [parent, slug] = key.includes(':') ? key.split(':', 2) : [null, key];
        const found = SOCIALJET_MENU_ITEMS.find(item =>
            item.slug === slug && (parent === null ? !item.parent : item.parent === parent)
        );
        if (!found) warnMissing('Menu item', key);
        return found ?? null;
    },
    registerMenuItem: (item) => upsert(SOCIALJET_MENU_ITEMS, item, a => a.slug === item.slug && a.parent === item.parent),

    getSettingsProviders: () => byPriority(SOCIALJET_SETTINGS_PROVIDERS),
    getSettingsProvider: (key) => {
        const found = SOCIALJET_SETTINGS_PROVIDERS.find(item => item.slug === key);
        if (!found) warnMissing('Settings provider', key);
        return found ?? null;
    },
    registerSettingsProvider: (item) => upsert(SOCIALJET_SETTINGS_PROVIDERS, item),

    getSettingsItems: () => Object.fromEntries(
        byPriority(Object.values(SOCIALJET_SETTINGS_ITEMS)).map(item => [settingKey(item), item])
    ),
    getSettingsItem: (key) => {
        const found = SOCIALJET_SETTINGS_ITEMS[key];
        if (!found) warnMissing('Settings item', key);
        return found ?? null;
    },
    registerSettingsItem: (item) => {
        SOCIALJET_SETTINGS_ITEMS[settingKey(item)] = item;
    },
    unRegisterSettingsItem: (provider, slug) => {
        delete SOCIALJET_SETTINGS_ITEMS[settingKey({provider, slug})];
    },

    registerAccountProvider: (item) => upsert(SOCIALJET_ACCOUNT_PROVIDERS, item),
    getAccountProviders: () => SOCIALJET_ACCOUNT_PROVIDERS,
    getAccountProvider: (key) => SOCIALJET_ACCOUNT_PROVIDERS.find(item => item.slug === key) ?? null,

    registerPostTag: (tag) => upsert(SOCIALJET_POST_TAGS, tag),
    getPostTags: () => SOCIALJET_POST_TAGS,
    getPostTag: (key) => {
        const found = SOCIALJET_POST_TAGS.find(item => item.slug === key);
        if (!found) warnMissing('Post tag', key);
        return found ?? null;
    },
};

window.SocialJet = SocialJet;
export const sj: SocialJetType = window.SocialJet;
