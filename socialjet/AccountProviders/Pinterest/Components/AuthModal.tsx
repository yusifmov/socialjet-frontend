import {useState} from "react";
import {useApi} from "../../../Hooks/useApi.ts";
import {Flex, Input, Modal, Switch, Typography} from "antd";
import {PinterestAuthType} from "../Types/PinterestAuthType.ts";

const AuthModal = (props: {
    open: boolean,
    setOpen: (open: boolean) => void,
}) => {
    const [authForm, setAuthForm] = useState<PinterestAuthType>({
        appId: '',
        appSecretKey: '',
        useProxy: false,
        proxy: ''
    });

    const callbackApi = useApi<null, {callback_url: string}>();
    const loginUrlApi = useApi<{app_id: string, app_secret_key: string, provider: string, proxy: string}, {login_url: string}>();

    const onOpen = (open: boolean) => {
        if (open) {
            callbackApi.sendRequest('socialjet/accounts/pinterest/get_callback_url')
        }
    }

    const authorize = () => {
        loginUrlApi.sendRequest('socialjet/accounts/pinterest/get_login_url', {
            app_id: authForm.appId,
            app_secret_key: authForm.appSecretKey,
            proxy: authForm.proxy,
            provider: 'pinterest'
        }).then(data => {
            window.open(data?.login_url, '_blank', 'width=800,height=600');
        })
    }

    return (
        <Modal
            title={'Add Pinterest Account'}
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
                            Use this URL as the redirect URL in your Pinterest app settings.
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
                    <Typography.Title level={5}>Pinterest App ID</Typography.Title>
                    <Input placeholder={'Enter your Pinterest App ID'} value={authForm.appId}
                           onChange={e => setAuthForm({...authForm, appId: e.target.value ?? ''})}/>
                </div>
                <div>
                    <Typography.Title level={5}>Pinterest App Secret Key</Typography.Title>
                    <Input placeholder={'Enter your Pinterest App Secret Key'} value={authForm.appSecretKey}
                           onChange={e => setAuthForm({...authForm, appSecretKey: e.target.value ?? ''})}/>
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