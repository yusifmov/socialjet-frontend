import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from './store.ts';
import {App, Card, Divider, Flex, Skeleton, Typography} from 'antd';
import {settingKey, useApi} from "@socialjet/sdk";
import {setInitialSettings, setSetting} from "./Slices/settingsSlice.ts";
import {sj} from "../../SocialJet.ts";

const Settings = () => {
    const dispatch = useDispatch();
    const {message} = App.useApp();
    const settings = useSelector((state: RootState) => state.settings);
    const listApi = useApi<undefined, Record<string, unknown>>();
    const saveApi = useApi<{ key: string; value: unknown }, unknown>();
    const {sendRequest: loadSettings} = listApi;

    useEffect(() => {
        loadSettings('socialjet/settings/all').then((res) => {
            if (res) dispatch(setInitialSettings(res));
        });
    }, [dispatch, loadSettings]);

    const save = async (key: string, value: unknown, previous: unknown) => {
        dispatch(setSetting({key, value}));
        const res = await saveApi.sendRequest('socialjet/settings/save', {key, value});
        if (res === null) {
            // Roll back so the screen shows what is actually stored.
            dispatch(setSetting({key, value: previous}));
            message.error('Could not save the setting.');
        } else {
            message.success('Saved');
        }
    };

    const items = Object.values(sj.getSettingsItems()).filter(i => i.targets.includes('settings'));
    const groups = sj.getSettingsProviders()
        .map(provider => ({provider, items: items.filter(i => i.provider === provider.slug)}))
        .filter(g => g.items.length > 0);

    if (listApi.loading && Object.keys(settings).length === 0) {
        return <Skeleton active paragraph={{rows: 4}}/>;
    }

    return (
        <Flex vertical gap={16} style={{maxWidth: 900}}>
            {groups.map(({provider, items}) => (
                <Card key={provider.slug} title={provider.title}>
                    {provider.description && (
                        <Typography.Paragraph type="secondary">{provider.description}</Typography.Paragraph>
                    )}
                    {items.map((item, i) => {
                        const key = settingKey(item);
                        return (
                            <div key={key}>
                                {i > 0 && <Divider style={{margin: '16px 0'}}/>}
                                <Typography.Text strong style={{display: 'block', marginBottom: 4}}>{item.title}</Typography.Text>
                                {item.description && (
                                    <Typography.Text type="secondary" style={{display: 'block', marginBottom: 8}}>
                                        {item.description}
                                    </Typography.Text>
                                )}
                                {item.render({
                                    value: settings[key] ?? item.defaultValue,
                                    setValue: value => save(key, value, settings[key]),
                                })}
                            </div>
                        );
                    })}
                </Card>
            ))}
        </Flex>
    );
};

export default Settings;
