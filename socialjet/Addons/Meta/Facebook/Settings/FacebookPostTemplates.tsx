import {SettingsItemType} from "../../../../Types/SettingsItemType.ts";
import {Select} from "antd";
import SocialPostSettingsProvider from "../../../../SettingItems/Providers/SocialPostSettingsProvider.tsx";

const FacebookPostTemplates: SettingsItemType<string> = {
    title: 'Select a social post template',
    slug: 'post_template',
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

export default FacebookPostTemplates;