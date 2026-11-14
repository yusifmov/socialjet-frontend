import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPinterest} from "@fortawesome/free-brands-svg-icons";
import PostTextSetting from "../../SettingItems/Items/PostSettings/PostTextSetting.tsx";
import AuthModal from "./Components/AuthModal.tsx";
import {AccountProviderType} from "../../Types/AccountProviderType.ts";
import {Select} from "antd";
import SocialPostSettingsProvider from "../../SettingItems/Providers/SocialPostSettingsProvider.tsx";
import {SettingsItemType} from "../../Types/SettingsItemType.ts";

export const PinterestPostTemplates: SettingsItemType<string> = {
    title: 'Select a social post template',
    slug: 'pinterest_post_template',
    description: 'This setting allows you to define how your post looks on Pinterest.',
    provider: SocialPostSettingsProvider.slug,
    targets: ['schedule', 'pinterest'],
    defaultValue: 'single_image',
    priority: 0,
    render: ({ value, setValue }) => (
        <Select style={{minWidth: '360px'}} value={value} onChange={setValue} options={[
            {value:'single_image', label: 'Single image'},
            {value:'gallery', label: 'Gallery (carousel)'},
        ]}/>
    ),
};

export const PinterestAccountProvider: AccountProviderType = {
    slug: 'pinterest',
    title: 'Pinterest',
    description: 'Pinterest',
    picture: <FontAwesomeIcon icon={faPinterest}></FontAwesomeIcon>,
    AuthModal: (props) => <AuthModal open={props.open} setOpen={props.setOpen} />,
    getAccountTypeText: (accountOrTypeKey) => {
        let type;

        if(typeof accountOrTypeKey === "string"){
            type = accountOrTypeKey;
        }
        else {
            type = accountOrTypeKey.type;
        }

        if(type === 'board'){
            return 'Pinterest board'
        }

        return 'Pinterest'
    },
    supportsSetting: (account, setting) => {
        return (
            setting.targets.includes(account.provider) ||
            [
                PostTextSetting.slug
            ].includes(setting.slug)
        )
    },
    getPostTemplates: () => []
};