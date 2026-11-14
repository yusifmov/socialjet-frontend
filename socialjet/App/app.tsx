/**
 * Registration manifest for everything that ships with the plugin (`app.js`).
 * Social networks live in /addons and use only the public SDK.
 */
import {sj} from "../SocialJet.ts";
import "../../addons/index.ts";

import {MenuItemHistory} from "../Menu/History/main.tsx";
import {MenuItemSchedules} from "../Menu/Schedules/main.tsx";
import {MenuItemAutoPosters} from "../Menu/AutoPosters/main.tsx";
import {MenuItemSettings} from "../Menu/Settings/main.tsx";
import {MenuItemAccounts} from "../Menu/Accounts/main.tsx";
import WordpressSettingsProvider from "../SettingItems/Providers/WordpressSettingsProvider.tsx";
import SocialPostSettingsProvider from "../SettingItems/Providers/SocialPostSettingsProvider.tsx";
import CronSetting from "../SettingItems/Items/SettingsMenu/CronSetting.tsx";
import PostTextSetting from "../SettingItems/Items/PostSettings/PostTextSetting.tsx";
import {PostTitleTag} from "../SettingItems/PostTextTags/PostTitleTag.ts";
import {PostContentTag} from "../SettingItems/PostTextTags/PostContentTag.tsx";
import {PostLinkTag} from "../SettingItems/PostTextTags/PostLinkTag.ts";

//Setting providers
sj.registerSettingsProvider(WordpressSettingsProvider);
sj.registerSettingsProvider(SocialPostSettingsProvider);

//Setting items
sj.registerSettingsItem(CronSetting);
sj.registerSettingsItem(PostTextSetting);

//Post text tags
sj.registerPostTag(PostTitleTag);
sj.registerPostTag(PostLinkTag);
sj.registerPostTag(PostContentTag);

//Menu items
sj.registerMenuItem(MenuItemAccounts);
sj.registerMenuItem(MenuItemSchedules);
sj.registerMenuItem(MenuItemAutoPosters);
sj.registerMenuItem(MenuItemHistory);
sj.registerMenuItem(MenuItemSettings);
