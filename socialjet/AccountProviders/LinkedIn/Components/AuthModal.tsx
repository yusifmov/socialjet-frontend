import {useState} from "react";
import {useApi} from "../../../Hooks/useApi.ts";
import {Flex, Input, Modal, Switch, Typography} from "antd";
import {LinkedInAuthType} from "../Types/LinkedInAuthType.ts";

const AuthModal = (props: {
    open: boolean,
    setOpen: (open: boolean) => void,
}) => {
    const [authForm, setAuthForm] = useState<LinkedInAuthType>({
        clientId: '',
        clientSecret: '',
        useProxy: false,
        proxy: '',
        enableOrganizations: false
    });

    const callbackApi = useApi<null, {callback_url: string}>();
    const loginUrlApi = useApi<{client_id: string, client_secret: string, provider: string, proxy: string, enable_organizations: boolean}, {login_url: string}>();

    const onOpen = (open: boolean) => {
        if (open) {
            callbackApi.sendRequest('socialjet/accounts/linkedin/get_callback_url')
        }
    }

    const authorize = () => {
        loginUrlApi.sendRequest('socialjet/accounts/linkedin/get_login_url', {
            client_id: authForm.clientId,
            client_secret: authForm.clientSecret,
            proxy: authForm.proxy,
            provider: 'linkedin',
            enable_organizations: authForm.enableOrganizations
        }).then(data => {
            window.open(data?.login_url, '_blank', 'width=800,height=600');
        })
    }

    return (
        <Modal
            title={'Add LinkedIn Account'}
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
                            Use this URL as the redirect URL in your LinkedIn app settings.
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
                    <Typography.Title level={5}>LinkedIn Client ID</Typography.Title>
                    <Input placeholder={'Enter your LinkedIn Client ID'} value={authForm.clientId}
                           onChange={e => setAuthForm({...authForm, clientId: e.target.value ?? ''})}/>
                </div>
                <div>
                    <Typography.Title level={5}>LinkedIn Client Secret</Typography.Title>
                    <Input.Password placeholder={'Enter your LinkedIn Client Secret'} value={authForm.clientSecret}
                           onChange={e => setAuthForm({...authForm, clientSecret: e.target.value ?? ''})}/>
                </div>
                <div>
                    <Typography.Title level={5}>Enable Organizations (Pages)</Typography.Title>
                    <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
                        Turn this on only if your LinkedIn app has the Community Management API
                        product approved. It lets you list and post as Organization pages you
                        administer. Leave it off to connect your personal profile only.
                    </Typography.Text>
                    <Switch checked={authForm.enableOrganizations}
                            onChange={checked => setAuthForm({...authForm, enableOrganizations: checked ?? false})}/>
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