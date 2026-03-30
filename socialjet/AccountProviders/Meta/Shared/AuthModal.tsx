import {useState} from 'react';
import {Flex, Input, Modal, Switch, Typography} from 'antd';
import {useApi} from "../../../Hooks/useApi.ts";
import {MetaAuthType} from "./MetaAuthType.ts";

const AuthModal = (props: {
    title: string,
    provider: string,
    open: boolean,
    setOpen: (open: boolean) => void,
}) => {
    const [authForm, setAuthForm] = useState<MetaAuthType>({
        appId: '',
        appSecret: '',
        useProxy: false,
        proxy: ''
    });

    const callbackApi = useApi<null, {callback_url: string}>();
    const loginUrlApi = useApi<{client_id: string, client_secret: string, provider: string, proxy: string}, {login_url: string}>();

    const onOpen = (open: boolean) => {
        if (open) {
            callbackApi.sendRequest('socialjet/addons/meta/get_callback_url')
        }
    }

    const authorize = () => {
        loginUrlApi.sendRequest('socialjet/addons/meta/get_login_url' + `${props.provider === 'threads' ? `_threads` : ''}`, {
            client_id: authForm.appId,
            client_secret: authForm.appSecret,
            proxy: authForm.proxy,
            provider: props.provider
        }).then(data => {
            window.open(data?.login_url, '_blank', 'width=800,height=600');
        })
    }

    return (
        <Modal
            title={props.title}
            open={props.open}
            onCancel={() => props.setOpen(false)}
            onOk={authorize}
            afterOpenChange={onOpen}
            okText={'Authorize'}
        >
            <Flex vertical={true} gap={3}>
                {callbackApi.data && (
                    <div>
                        <Typography.Title level={5}>Callback URL</Typography.Title>
                        <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
                            Use this URL as the redirect URL in your Facebook app settings.
                        </Typography.Text>
                        <Typography.Paragraph
                            copyable={{ text: callbackApi.data.callback_url }}
                            style={{ wordBreak: 'break-all' }}
                        >
                            {callbackApi.data.callback_url}
                        </Typography.Paragraph>
                    </div>
                )}
                <div>
                    <Typography.Title level={5}>Facebook APP ID</Typography.Title>
                    <Input placeholder={'Enter your Facebook App ID'} value={authForm.appId}
                           onChange={e => setAuthForm({...authForm, appId: e.target.value ?? ''})}/>
                </div>
                <div>
                    <Typography.Title level={5}>Facebook APP Secret</Typography.Title>
                    <Input placeholder={'Enter your Facebook App Secret'} value={authForm.appSecret}
                           onChange={e => setAuthForm({...authForm, appSecret: e.target.value ?? ''})}/>
                </div>
                <div>
                    <Typography.Title level={5}>Use proxy</Typography.Title>
                    <Switch checked={authForm.useProxy}
                            onChange={checked => setAuthForm({...authForm, useProxy: checked ?? false})}/>
                </div>
                {authForm.useProxy &&
                  <div>
                    <Typography.Title level={5}>Enter proxy</Typography.Title>
                    <Input placeholder={'Enter a proxy'} value={authForm.proxy}
                           onChange={e => setAuthForm({...authForm, proxy: e.target.value ?? ''})}/>
                  </div>
                }
            </Flex>
        </Modal>
    );
};

export default AuthModal;