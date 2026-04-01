import AuthModal from "./Shared/AuthModal.tsx";
import PostTextSetting from "../../SettingItems/Items/PostSettings/PostTextSetting.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebook} from "@fortawesome/free-brands-svg-icons";
import {Select} from "antd";
import SocialPostSettingsProvider from "../../SettingItems/Providers/SocialPostSettingsProvider.tsx";
import {SettingsItemType} from "../../Types/SettingsItemType.ts";
import {AccountProviderType} from "../../Types/AccountProviderType.ts";

export const FacebookPostTemplates: SettingsItemType<string> = {
    title: 'Select a social post template',
    slug: 'facebook_post_template',
    description: 'This setting allows you to define how your post looks on Facebook.',
    provider: SocialPostSettingsProvider.slug,
    targets: ['schedule', 'facebook'],
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

export const FacebookAccountProvider: AccountProviderType ={
    slug: 'facebook',
    title: 'Facebook',
    description: 'Facebook',
    picture: <FontAwesomeIcon icon={faFacebook}></FontAwesomeIcon>,
    AuthModal: (props) => <AuthModal open={props.open} setOpen={props.setOpen} title = 'Add Facebook accounts' provider = 'facebook' />,
    getAccountTypeText: () => {
        return 'Facebook Page'
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
}