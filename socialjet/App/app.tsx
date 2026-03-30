import {sj} from "../SocialJet.ts";
import {FacebookAccountProvider, FacebookPostTemplates} from "../AccountProviders/Meta/facebook.tsx";
import {ThreadsAccountProvider, ThreadsPostTemplates} from "../AccountProviders/Meta/threads.tsx";
import {InstagramAccountProvider, InstagramPostTemplates} from "../AccountProviders/Meta/instagram.tsx";
import {LinkedInAccountProvider, LinkedInPostTemplates} from "../AccountProviders/LinkedIn/linkedin.tsx";

import {MenuItemAccounts} from "../Menu/Accounts/main.tsx";
import {MenuItemHistory} from "../Menu/History/main.tsx";
import {MenuItemSchedules} from "../Menu/Schedules/main.tsx";
import {MenuItemSettings} from "../Menu/Settings/main.tsx";
import WordpressSettingsProvider from "../SettingItems/Providers/WordpressSettingsProvider.tsx";
import SocialPostSettingsProvider from "../SettingItems/Providers/SocialPostSettingsProvider.tsx";
import CronSetting from "../SettingItems/Items/SettingsMenu/CronSetting.tsx";
import PostTextSetting from "../SettingItems/Items/PostSettings/PostTextSetting.tsx";
import {PostTitleTag} from "../SettingItems/PostTextTags/PostTitleTag.ts";
import {PostContentTag} from "../SettingItems/PostTextTags/PostContentTag.tsx";
import {PostLinkTag} from "../SettingItems/PostTextTags/PostLinkTag.ts";

//Account Providers
sj.registerAccountProvider(FacebookAccountProvider);
sj.registerAccountProvider(ThreadsAccountProvider);
sj.registerAccountProvider(InstagramAccountProvider);
sj.registerAccountProvider(LinkedInAccountProvider);

//SettingProviders
sj.registerSettingsProvider(WordpressSettingsProvider);
sj.registerSettingsProvider(SocialPostSettingsProvider);

//SettingItems
sj.registerSettingsItem(FacebookPostTemplates);
sj.registerSettingsItem(ThreadsPostTemplates);
sj.registerSettingsItem(InstagramPostTemplates);
sj.registerSettingsItem(LinkedInPostTemplates);

sj.registerSettingsItem(CronSetting);
sj.registerSettingsItem(PostTextSetting);

//PostTextTags
sj.registerPostTag(PostTitleTag);
sj.registerPostTag(PostLinkTag);
sj.registerPostTag(PostContentTag);

//Menu Items
sj.registerMenuItem(MenuItemAccounts);
sj.registerMenuItem(MenuItemHistory);
sj.registerMenuItem(MenuItemSchedules);
sj.registerMenuItem(MenuItemSettings);
