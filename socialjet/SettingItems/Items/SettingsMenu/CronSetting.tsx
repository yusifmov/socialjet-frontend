import {Space, Switch, Typography} from 'antd';
import { SettingsItemType } from '../../../Types/SettingsItemType.ts';
import WordpressSettingsProvider from "../../Providers/WordpressSettingsProvider.tsx";
import {CopyOutlined} from "@ant-design/icons";

const {Paragraph, Text} = Typography;

const command = `wget -q -O - ${window.SocialJetCronUrl} >/dev/null 2>&1`;


const CronSetting: SettingsItemType<boolean> = {
    title: 'Use Real Cron',
    slug: 'cron_enabled',
    description: <Space direction="vertical">
        <Text>
            It is a better practice to set up a Cronjob for your schedules to run smoothly in background.
            Please, set your Cronjob to run every minute. After setting up your Cronjob enable this option.
            You can set up a system cron using this command:
        </Text>
        <Paragraph copyable={{ text: command, icon: <CopyOutlined /> }}>
            <code>{command}</code>
        </Paragraph>
    </Space>,
    provider: WordpressSettingsProvider.slug,
    targets: ['settings'],
    defaultValue: false,
    priority: 0,
    render: ({ value, setValue }) => (
        <Switch checked={value} onChange={setValue} />
    ),
};

export default CronSetting;