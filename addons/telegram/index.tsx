/** Telegram channels and groups, through a bot token. PHP side: SocialJet/Accounts/Telegram. */
import {useState} from "react";
import {Alert, Flex, Input, Modal, Switch, Typography} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTelegram} from "@fortawesome/free-brands-svg-icons";
import {
    AuthModalPropsType,
    createAccountProvider,
    createPostTemplateSetting,
    notifyAccountsChanged,
    sj,
    STANDARD_POST_TEMPLATES,
    useApi,
} from "@socialjet/sdk";

function TelegramAuthModal({open, setOpen}: AuthModalPropsType) {
    const [token, setToken] = useState('');
    const [useProxy, setUseProxy] = useState(false);
    const [proxy, setProxy] = useState('');
    const {sendRequest, error, loading} = useApi<{ token: string, proxy: string }, { message: string }>();

    const add = async () => {
        const data = await sendRequest('socialjet/accounts/telegram/add-channels', {
            token: token.trim(),
            proxy: useProxy ? proxy : '',
        });
        if (data) {
            // Same signal the OAuth popups send: the Accounts page refreshes and closes dialogs.
            notifyAccountsChanged(true, data.message);
            setOpen(false);
        }
    };

    return (
        <Modal
            title="Add Telegram channels"
            open={open}
            onCancel={() => setOpen(false)}
            onOk={add}
            okText="Add channels"
            okButtonProps={{disabled: !token.trim(), loading}}
            destroyOnHidden
        >
            <Flex vertical gap={16}>
                <Typography.Text type="secondary">
                    Create a bot with <Typography.Link href="https://t.me/BotFather" target="_blank">@BotFather</Typography.Link>,
                    add it as an admin to your channels or groups, and post something there once —
                    SocialJet finds the chats the bot can see.
                </Typography.Text>
                <div>
                    <Typography.Text strong style={{display: 'block', marginBottom: 4}}>Bot token</Typography.Text>
                    <Input.Password placeholder="123456:ABC-DEF..." value={token} onChange={e => setToken(e.target.value)}/>
                </div>
                <div>
                    <Flex gap={8} align="center">
                        <Switch size="small" checked={useProxy} onChange={setUseProxy}/>
                        <Typography.Text>Connect through a proxy</Typography.Text>
                    </Flex>
                    {useProxy && (
                        <Input style={{marginTop: 8}} placeholder="http://user:pass@host:port" value={proxy}
                               onChange={e => setProxy(e.target.value)}/>
                    )}
                </div>
                {error && <Alert type="error" showIcon message={error}/>}
            </Flex>
        </Modal>
    );
}

sj.registerAccountProvider(createAccountProvider({
    slug: 'telegram',
    title: 'Telegram',
    icon: <FontAwesomeIcon icon={faTelegram}/>,
    accountTypes: {channel: 'Channel', group: 'Group', supergroup: 'Group'},
    defaultTypeText: 'Telegram chat',
    AuthModal: TelegramAuthModal,
}));

sj.registerSettingsItem(createPostTemplateSetting({
    provider: 'telegram',
    networkName: 'Telegram',
    templates: STANDARD_POST_TEMPLATES,
    defaultValue: 'link_card',
}));
