import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faThreads} from "@fortawesome/free-brands-svg-icons";
import AuthModal from "./Shared/AuthModal.tsx";
import PostTextSetting from "../../SettingItems/Items/PostSettings/PostTextSetting.tsx";
import {AccountProviderType} from "../../Types/AccountProviderType.ts";
import {SettingsItemType} from "../../Types/SettingsItemType.ts";
import SocialPostSettingsProvider from "../../SettingItems/Providers/SocialPostSettingsProvider.tsx";
import {Select} from "antd";

export const ThreadsPostTemplates: SettingsItemType<string> = {
    title: 'Select a social post template',
    slug: 'post_template',
    description: 'This setting allows you to define how your post looks on Threads.',
    provider: SocialPostSettingsProvider.slug,
    targets: ['schedule', 'threads'],
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

export const ThreadsAccountProvider: AccountProviderType = {
    slug: 'threads',
    title: 'Threads',
    description: 'Threads',
    picture: <FontAwesomeIcon icon={faThreads}></FontAwesomeIcon>,
    AuthModal: (props) => <AuthModal
        open={props.open}
        setOpen={props.setOpen}
        title = 'Add Threads accounts'
        provider = 'threads'
    />,
    getAccountTypeText: () => {
        return 'Threads account'
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