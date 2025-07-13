import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import {Card, Spin} from 'antd';
import {useApi} from "../Hooks/useApi";
import {setInitialSettings, setSetting} from "./Slices/settingsSlice";
import {sj} from "../SocialJet";

const Settings = () => {
    const dispatch = useDispatch();
    const settings = useSelector((state: RootState) => state.settings);
    const listApi = useApi<undefined, Record<string, any>>();
    const saveApi = useApi<{ key: string; value: any }, any>();

    useEffect(() => {
        listApi.sendRequest('socialjet/settings/all').then((res) => {
            if (res) dispatch(setInitialSettings(res));
        });
    }, []);

    const items = sj.getSettingsItems().filter(i => i.targets.includes('settings'));
    const grouped = items.reduce((acc, cur) => {
        if (!acc[cur.provider]) acc[cur.provider] = [];
        acc[cur.provider].push(cur);
        return acc;
    }, {} as Record<string, typeof items>);

    return (
        <Spin spinning={listApi.loading || saveApi.loading}>
            {Object.entries(grouped).map(([provider, group]) => {
                const providerMeta = sj.getSettingsProvider(provider); // Get metadata
                return (
                    <Card
                        key={provider}
                        title={providerMeta.title}
                        extra={<div>{providerMeta.description}</div>}
                        style={{ marginBottom: 16 }}
                    >
                        {group.map(item => (
                            <div key={item.slug} style={{ marginBottom: 12 }}>
                                <strong>{item.title}</strong>
                                {item.description && (
                                    <div style={{ fontStyle: 'italic', color: '#666' }}>{item.description}</div>
                                )}
                                <div>
                                    {item.render({
                                        value: settings[`${item.provider}:${item.slug}`],
                                        setValue: value => {
                                            dispatch(setSetting({ key: `${item.provider}:${item.slug}`, value }));
                                            saveApi.sendRequest('socialjet/settings/save', { key: `${item.provider}:${item.slug}`, value });
                                        },
                                    })}
                                </div>
                            </div>
                        ))}
                    </Card>
                );
            })}
        </Spin>
    );
};

export default Settings;