import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTelegram} from "@fortawesome/free-brands-svg-icons";
import PostTextSetting from "../../SettingItems/Items/PostSettings/PostTextSetting.tsx";
import AuthModal from "./Components/AuthModal.tsx";
import {AccountProviderType} from "../../Types/AccountProviderType.ts";
import {Select} from "antd";
import SocialPostSettingsProvider from "../../SettingItems/Providers/SocialPostSettingsProvider.tsx";
import {SettingsItemType} from "../../Types/SettingsItemType.ts";

export const TelegramPostTemplates: SettingsItemType<string> = {
    title: 'Select a social post template',
    slug: 'telegram_post_template',
    description: 'This setting allows you to define how your post looks on Telegram.',
    provider: SocialPostSettingsProvider.slug,
    targets: ['schedule', 'telegram'],
    defaultValue: 'link_card',
    priority: 0,
    render: ({ value, setValue }) => (
        <Select style={{minWidth: '360px'}} defaultValue={value} onChange={setValue} options={[
            {value:'link_card', label: 'LinkCard view'},
            {value:'single_image', label: 'Single image'},
            {value:'gallery', label: 'Gallery'},
            {value:'text', label: 'Text only'},
        ]}/>
    ),
};

export const TelegramAccountProvider: AccountProviderType = {
    slug: 'telegram',
    title: 'telegram',
    description: 'Telegram',
    picture: <FontAwesomeIcon icon={faTelegram}></FontAwesomeIcon>,
    AuthModal: (props) => <AuthModal open={props.open} setOpen={props.setOpen} />,
    getAccountTypeText: (accountOrTypeKey) => {
        let type;

        if(typeof accountOrTypeKey === "string"){
            type = accountOrTypeKey;
        }
        else {
            type = accountOrTypeKey.type;
        }

        if(type === 'channel'){
            return 'Channel'
        }

        if(type === 'group' || type === 'supergroup'){
            return 'Group'
        }

        return 'Telegram Chat'
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