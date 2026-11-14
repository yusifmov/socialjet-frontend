import {FC, useEffect, useState} from 'react';
import {Button, Empty, Flex, Input, Tooltip, Typography, theme} from 'antd';
import {CloseOutlined, EditOutlined, SearchOutlined, TeamOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import useAccountPickerModal from "../Hooks/useAccountPickerModal.tsx";
import {ScheduleDispatch, ScheduleState} from "../store.ts";
import AccountSettingType from "../Types/AccountSettingType.ts";
import {sj} from "../../../SocialJet.ts";
import ProfileImage from "./ProfileImage.tsx";
import {removeAccountSetting, updateAccountSetting} from "../Slices/scheduleSlice.ts";

/** Settings items that apply to this account in the schedule editor. */
const settingsFor = (accountSetting: AccountSettingType) => Object.values(sj.getSettingsItems())
    .filter(s => s.targets.includes('schedule') &&
        sj.getAccountProvider(accountSetting.account.provider)?.supportsSetting(accountSetting.account, s));

function AccountSettingsPanel({accountSetting}: { accountSetting: AccountSettingType }) {
    const {token} = theme.useToken();
    const dispatch = useDispatch<ScheduleDispatch>();
    const {account} = accountSetting;
    const provider = sj.getAccountProvider(account.provider);
    const items = settingsFor(accountSetting);

    return (
        <Flex vertical gap={16}>
            <Flex align="center" gap={12} style={{paddingBottom: 12, borderBottom: `1px solid ${token.colorBorderSecondary}`}}>
                <ProfileImage account={account}/>
                <Flex vertical style={{minWidth: 0}}>
                    <Typography.Text strong style={{fontSize: 15}} ellipsis>{account.title}</Typography.Text>
                    <Typography.Text type="secondary" style={{fontSize: 12}}>
                        {provider?.title} · {provider?.getAccountTypeText(account)}
                    </Typography.Text>
                </Flex>
            </Flex>

            {items.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No settings for this account"/>}

            {items.map(s => {
                const key = s.provider + ':' + s.slug;
                return (
                    <div key={key} style={{
                        padding: 16,
                        borderRadius: token.borderRadiusLG,
                        border: `1px solid ${token.colorBorderSecondary}`,
                        background: token.colorBgContainer,
                    }}>
                        <Typography.Text strong style={{display: 'block'}}>{s.title}</Typography.Text>
                        {s.description && (
                            <Typography.Paragraph type="secondary" style={{fontSize: 13, margin: '2px 0 12px'}}>
                                {s.description}
                            </Typography.Paragraph>
                        )}
                        {s.render({
                            setValue: value => dispatch(updateAccountSetting({account_id: account.id, value, setting_key: key})),
                            value: accountSetting.settings[key],
                        })}
                    </div>
                );
            })}
        </Flex>
    );
}

const AccountSettingsStep: FC = () => {
    const {token} = theme.useToken();
    const [activeId, setActiveId] = useState<number | undefined>(undefined);
    const [filter, setFilter] = useState('');
    const accountSettings = useSelector((state: ScheduleState) => state.schedule.accountSettings);
    const {modal: AccountPickerModal, setOpen: setAccountsModalOpen} = useAccountPickerModal();
    const dispatch = useDispatch<ScheduleDispatch>();

    useEffect(() => {
        if (!accountSettings.some(s => s.account.id === activeId)) setActiveId(accountSettings[0]?.account.id);
    }, [accountSettings, activeId]);

    if (accountSettings.length === 0) {
        return (
            <>
                <Flex vertical align="center" justify="center" gap={12} style={{height: '100%', padding: 24, boxSizing: 'border-box', textAlign: 'center'}}>
                    <div style={{
                        width: 56, height: 56, borderRadius: '50%', display: 'grid', placeItems: 'center',
                        background: token.colorPrimaryBg, color: token.colorPrimary, fontSize: 24,
                    }}><TeamOutlined/></div>
                    <Typography.Title level={5} style={{margin: 0}}>Where should posts go?</Typography.Title>
                    <Typography.Text type="secondary">Pick the accounts, pages or channels to share to.</Typography.Text>
                    <Button type="primary" size="large" onClick={() => setAccountsModalOpen(true)}>Select accounts</Button>
                </Flex>
                {AccountPickerModal}
            </>
        );
    }

    const active = accountSettings.find(s => s.account.id === activeId) ?? accountSettings[0];
    const q = filter.trim().toLowerCase();
    const shown = q ? accountSettings.filter(s => s.account.title.toLowerCase().includes(q)) : accountSettings;

    return (
        <Flex style={{height: '100%', minHeight: 0}}>
            <Flex vertical style={{
                width: 240,
                flexShrink: 0,
                borderRight: `1px solid ${token.colorBorderSecondary}`,
                background: token.colorFillQuaternary,
                minHeight: 0,
            }}>
                <Flex vertical gap={8} style={{padding: 12}}>
                    <Flex justify="space-between" align="center">
                        <Typography.Text type="secondary" style={{fontSize: 12, textTransform: 'uppercase', letterSpacing: .5}}>
                            {accountSettings.length} account{accountSettings.length === 1 ? '' : 's'}
                        </Typography.Text>
                        <Button size="small" type="link" icon={<EditOutlined/>} onClick={() => setAccountsModalOpen(true)}
                                style={{paddingInline: 0}}>
                            Change
                        </Button>
                    </Flex>
                    {accountSettings.length > 6 && (
                        <Input size="small" allowClear prefix={<SearchOutlined style={{opacity: .5}}/>} placeholder="Filter…"
                               value={filter} onChange={e => setFilter(e.target.value)}/>
                    )}
                </Flex>
                <Flex vertical gap={2} style={{overflowY: 'auto', padding: '0 8px 8px', flex: 1}}>
                    {shown.map(s => {
                        const isActive = s.account.id === active.account.id;
                        return (
                            <Flex
                                key={s.account.id}
                                align="center"
                                gap={10}
                                onClick={() => setActiveId(s.account.id)}
                                style={{
                                    padding: '8px 8px',
                                    borderRadius: token.borderRadius,
                                    cursor: 'pointer',
                                    background: isActive ? token.colorBgContainer : undefined,
                                    boxShadow: isActive ? token.boxShadowTertiary : undefined,
                                    borderLeft: `3px solid ${isActive ? token.colorPrimary : 'transparent'}`,
                                }}
                            >
                                <ProfileImage account={s.account} size={32}/>
                                <Flex vertical style={{minWidth: 0, flex: 1}}>
                                    <Typography.Text ellipsis strong={isActive} style={{fontSize: 13}}>{s.account.title}</Typography.Text>
                                    <Typography.Text type="secondary" ellipsis style={{fontSize: 11}}>
                                        {sj.getAccountProvider(s.account.provider)?.title}
                                    </Typography.Text>
                                </Flex>
                                <Tooltip title="Remove">
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<CloseOutlined style={{fontSize: 11}}/>}
                                        onClick={e => {
                                            e.stopPropagation();
                                            dispatch(removeAccountSetting(s));
                                        }}
                                    />
                                </Tooltip>
                            </Flex>
                        );
                    })}
                </Flex>
            </Flex>
            <div style={{flex: 1, minWidth: 0, overflowY: 'auto', padding: 20}}>
                <AccountSettingsPanel key={active.account.id} accountSetting={active}/>
            </div>
            {AccountPickerModal}
        </Flex>
    );
};

export default AccountSettingsStep;
