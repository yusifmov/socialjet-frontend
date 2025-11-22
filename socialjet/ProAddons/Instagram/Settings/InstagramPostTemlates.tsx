import {Select} from "antd";
import SocialPostSettingsProvider from "../../../SettingItems/Providers/SocialPostSettingsProvider.tsx";
import {SettingsItemType} from "../../../Types/SettingsItemType.ts";

const InstagramPostTemplates: SettingsItemType<string> = {
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

export default InstagramPostTemplates;