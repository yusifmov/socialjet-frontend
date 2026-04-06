import {useEffect, useState} from "react";
import {useApi} from "../../../Hooks/useApi.ts";
import {App, Flex, Input, Modal, Switch, Typography} from "antd";
import {TelegramAuthType} from "../Types/TelegramAuthType.ts";

const AuthModal = (props: {
    open: boolean,
    setOpen: (open: boolean) => void,
}) => {
    const [authForm, setAuthForm] = useState<TelegramAuthType>({
        token: '',
        useProxy: false,
        proxy: ''
    });

    const {message} = App.useApp();

    const {sendRequest: addChannels, error, loading} = useApi<{token: string, proxy: string}, {message: string}>();

    useEffect(() => {
        if (!error) return;

        message.error(error)
    }, [error])

    const authorize = () => {
        addChannels('socialjet/accounts/telegram/add-channels', {
            token: authForm.token,
            proxy: authForm.proxy,
        }).then(data => {
            if (!data) return;

            message.success(data.message);
            props.setOpen(false);
        })
    }

    return (
        <Modal
            title={'Add Telegram Account'}
            open={props.open}
            onCancel={() => props.setOpen(false)}
            onOk={authorize}
            okText={'Add channels'}
            loading={loading}
        >
            <Flex vertical={true} gap={3}>
                <div>
                    <Typography.Title level={5}>Telegram Bot Token</Typography.Title>
                    <Input placeholder={'Enter your Telegram Bot Token'} value={authForm.token}
                           onChange={e => setAuthForm({...authForm, token: e.target.value ?? ''})}/>
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