import {Dispatch, SetStateAction, useEffect, useMemo, useState} from "react";
import {Button, Empty, Flex, Input, Modal, Segmented, Select, Space, Spin, Tag, Typography} from "antd";
import {SearchOutlined, WarningOutlined} from "@ant-design/icons";
import {useDispatch} from "react-redux";
import {type AccountType, isAccountExpired, normalizeAccount, useApi} from "@socialjet/sdk";
import ProfileImage from "./ProfileImage.tsx";
import store, {ScheduleDispatch} from "../store.ts";
import {pushAccountSetting, removeAccountSetting} from "../Slices/scheduleSlice.ts";
import {sj} from "../../../SocialJet.ts";
import PickerRow from "./PickerRow.tsx";

const ALL = '__all';

const typeText = (account: AccountType) =>
    sj.getAccountProvider(account.provider)?.getAccountTypeText(account) ?? account.type ?? '';

/** Search and filtering happen client-side: `accounts/all` already returns every account. */
function AccountPickerModal(props: { zIndex: number, open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {
    const {data, loading, error, sendRequest} = useApi<null, AccountType[]>();
    const accounts = useMemo(() => (data ?? []).map(a => normalizeAccount(a)), [data]);

    const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);
    const [search, setSearch] = useState('');
    const [provider, setProvider] = useState<string>(ALL);
    const [accountType, setAccountType] = useState<string | undefined>(undefined);
    const [view, setView] = useState<'all' | 'selected'>('all');
    const dispatch = useDispatch<ScheduleDispatch>();

    const isSelected = (id: number) => selectedAccounts.includes(id);
    const toggle = (id: number) => setSelectedAccounts(current =>
        current.includes(id) ? current.filter(e => e !== id) : [...current, id]);

    const providers = useMemo(() => {
        const counts = new Map<string, number>();
        accounts.forEach(a => counts.set(a.provider, (counts.get(a.provider) ?? 0) + 1));
        return [...counts.entries()].map(([slug, count]) => ({slug, count, provider: sj.getAccountProvider(slug)}));
    }, [accounts]);

    const typeOptions = useMemo(() => {
        const types = new Set(accounts
            .filter(a => provider === ALL || a.provider === provider)
            .map(typeText)
            .filter(Boolean));
        return [...types].sort().map(t => ({value: t, label: t}));
    }, [accounts, provider]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return accounts.filter(a =>
            (view === 'all' || selectedAccounts.includes(a.id)) &&
            (provider === ALL || a.provider === provider) &&
            (!accountType || typeText(a) === accountType) &&
            (!q || a.title.toLowerCase().includes(q) || (a.account_key ?? '').toLowerCase().includes(q)),
        );
    }, [accounts, search, provider, accountType, view, selectedAccounts]);

    const allVisibleSelected = filtered.length > 0 && filtered.every(a => isSelected(a.id));
    const toggleAllVisible = () => {
        const ids = filtered.map(a => a.id);
        setSelectedAccounts(current => allVisibleSelected
            ? current.filter(id => !ids.includes(id))
            : [...new Set([...current, ...ids])]);
    };

    const pickProvider = (slug: string) => {
        setProvider(slug);
        setAccountType(undefined);
    };

    const onOk = () => {
        const current = store.getState().schedule.accountSettings;
        const preselected = current.map(e => e.account.id);

        current.forEach(accountSetting => {
            if (!selectedAccounts.includes(accountSetting.account.id)) {
                dispatch(removeAccountSetting(accountSetting));
            }
        });

        selectedAccounts.forEach(id => {
            if (preselected.includes(id)) return;
            const account = accounts.find(e => e.id === id);
            if (account) dispatch(pushAccountSetting(account));
        });

        props.setOpen(false);
    };

    useEffect(() => {
        if (props.open) {
            sendRequest("socialjet/accounts/all");
            setSelectedAccounts(store.getState().schedule.accountSettings.map(e => e.account.id));
        } else {
            setSelectedAccounts([]);
            setSearch('');
            setProvider(ALL);
            setAccountType(undefined);
            setView('all');
        }
    }, [props.open, sendRequest]);

    return (
        <Modal
            title="Select accounts"
            open={props.open}
            zIndex={props.zIndex}
            width={680}
            onCancel={() => props.setOpen(false)}
            footer={
                <Flex justify="space-between" align="center">
                    <Typography.Text type="secondary">
                        <Typography.Text strong>{selectedAccounts.length}</Typography.Text> account{selectedAccounts.length === 1 ? '' : 's'} selected
                        {selectedAccounts.length > 0 && <Button type="link" size="small" onClick={() => setSelectedAccounts([])}>Clear</Button>}
                    </Typography.Text>
                    <Space>
                        <Button onClick={() => props.setOpen(false)}>Cancel</Button>
                        <Button type="primary" onClick={onOk}>Confirm selection</Button>
                    </Space>
                </Flex>
            }
        >
            <Flex vertical gap={12}>
                <Flex gap={8}>
                    <Input
                        allowClear
                        size="large"
                        prefix={<SearchOutlined style={{opacity: .5}}/>}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search accounts by name or ID…"
                    />
                    <Select
                        allowClear
                        size="large"
                        placeholder="Any type"
                        style={{width: 200, flexShrink: 0}}
                        value={accountType}
                        onChange={setAccountType}
                        options={typeOptions}
                        disabled={typeOptions.length === 0}
                    />
                </Flex>

                {providers.length > 1 && (
                    <Flex gap={6} wrap="wrap">
                        <Tag.CheckableTag checked={provider === ALL} onChange={() => pickProvider(ALL)} style={{padding: '4px 12px'}}>
                            All networks · {accounts.length}
                        </Tag.CheckableTag>
                        {providers.map(p => (
                            <Tag.CheckableTag
                                key={p.slug}
                                checked={provider === p.slug}
                                onChange={() => pickProvider(provider === p.slug ? ALL : p.slug)}
                                style={{padding: '4px 12px'}}
                            >
                                <Space size={6}>
                                    {p.provider?.picture}
                                    <span>{p.provider?.title ?? p.slug} · {p.count}</span>
                                </Space>
                            </Tag.CheckableTag>
                        ))}
                    </Flex>
                )}

                <Flex justify="space-between" align="center">
                    <Segmented
                        size="small"
                        value={view}
                        onChange={v => setView(v as 'all' | 'selected')}
                        options={[
                            {value: 'all', label: `All (${accounts.length})`},
                            {value: 'selected', label: `Selected (${selectedAccounts.length})`},
                        ]}
                    />
                    <Button size="small" disabled={filtered.length === 0} onClick={toggleAllVisible}>
                        {allVisibleSelected ? 'Unselect shown' : `Select shown (${filtered.length})`}
                    </Button>
                </Flex>

                <Spin spinning={loading}>
                    <div style={{height: 'min(360px, 42vh)', overflowY: 'auto', margin: '0 -4px', padding: '0 4px'}}>
                        {filtered.length === 0 && !loading && (
                            <Flex align="center" justify="center" style={{height: '100%'}}>
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={error ?? (accounts.length === 0
                                        ? 'No accounts connected yet — add one on the Accounts page'
                                        : view === 'selected' ? 'No accounts selected yet' : 'No accounts match these filters')}
                                />
                            </Flex>
                        )}
                        <Flex vertical gap={4}>
                            {filtered.map(account => (
                                <PickerRow
                                    key={account.id}
                                    selected={isSelected(account.id)}
                                    onToggle={() => toggle(account.id)}
                                    media={<ProfileImage account={account}/>}
                                    title={account.title}
                                    meta={
                                        <Space size={6} split={<span style={{opacity: .4}}>·</span>}>
                                            <span>{sj.getAccountProvider(account.provider)?.title ?? account.provider}</span>
                                            {typeText(account) && <span>{typeText(account)}</span>}
                                        </Space>
                                    }
                                    extra={isAccountExpired(account) && (
                                        <Tag icon={<WarningOutlined/>} color="warning" style={{marginInlineEnd: 0}}>Expired</Tag>
                                    )}
                                />
                            ))}
                        </Flex>
                    </div>
                </Spin>
            </Flex>
        </Modal>
    );
}

export default AccountPickerModal;
