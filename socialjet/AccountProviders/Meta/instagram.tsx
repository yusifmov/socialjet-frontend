import AuthModal from "./Shared/AuthModal.tsx";
import PostTextSetting from "../../SettingItems/Items/PostSettings/PostTextSetting.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInstagram} from "@fortawesome/free-brands-svg-icons";
import {AccountProviderType} from "../../Types/AccountProviderType.ts";
import {Select} from "antd";
import SocialPostSettingsProvider from "../../SettingItems/Providers/SocialPostSettingsProvider.tsx";
import {SettingsItemType} from "../../Types/SettingsItemType.ts";

export const InstagramPostTemplates: SettingsItemType<string> = {
    title: 'Select a social post template',
    slug: 'post_template',
    description: 'This setting allows you to define what to share on Instagram.',
    provider: SocialPostSettingsProvider.slug,
    targets: ['schedule', 'instagram'],
    defaultValue: 'single_image',
    priority: 0,
    render: ({ value, setValue }) => {
        return <Select style={{minWidth: '360px'}} defaultValue={value} onChange={setValue} options={[
            {value:'single_image', label: 'Single image'},
            {value:'gallery', label: 'Gallery'},
        ]}/>
    },
};

export const InstagramAccountProvider: AccountProviderType = {
    slug: 'instagram',
    title: 'Instagram',
    description: 'Instagram',
    getAccountTypeText: (accountOrTypeKey) => {
        let type;

        if(typeof accountOrTypeKey === "string"){
            type = accountOrTypeKey;
        }
        else {
            type = accountOrTypeKey.type;
        }

        if(type === 'page_feed'){
            return 'Instagram Feed'
        }

        if(type === 'page_story'){
            return 'Instagram Story'
        }

        return 'Instagram'
    },
    picture: <FontAwesomeIcon icon={faInstagram}></FontAwesomeIcon>,
    AuthModal: (props) => <AuthModal open={props.open} setOpen={props.setOpen} title = 'Add Instagram pages' provider = 'instagram' />,
    supportsSetting: (account, setting) => {
        if(
            setting.slug === PostTextSetting.slug &&
            account.type === 'page_story'
        ) return false;

        return setting.targets.includes(account.provider) ||
            [
                PostTextSetting.slug
            ].includes(setting.slug);
    },
    getPostTemplates: () => []
}
