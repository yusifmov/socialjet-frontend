import {sj} from "../SocialJet";
import WordpressSettingsProvider from "./Providers/WordpressSettingsProvider";
import CronSetting from "./Items/CronSetting";
import PostTextSetting from "./Items/PostTextSetting";
import {PostContentTag} from "./PostTextTags/PostContentTag.tsx";
import {PostLinkTag} from "./PostTextTags/PostLinkTag.ts";
import {PostTitleTag} from "./PostTextTags/PostTitleTag.ts";
import SocialPostSettingsProvider from "./Providers/SocialPostSettingsProvider.tsx";
import FacebookPostTemplates from "./Items/PostTemplates/FacebookPostTemplates.tsx";

sj.registerSettingsProvider(WordpressSettingsProvider);
sj.registerSettingsProvider(SocialPostSettingsProvider);

sj.registerSettingsItem(CronSetting);
sj.registerSettingsItem(FacebookPostTemplates);
sj.registerSettingsItem(PostTextSetting);

sj.registerPostTag(PostTitleTag);
sj.registerPostTag(PostLinkTag);
sj.registerPostTag(PostContentTag);
