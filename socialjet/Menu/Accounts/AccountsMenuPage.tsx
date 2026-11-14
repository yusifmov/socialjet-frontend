import {useCallback, useEffect, useMemo, useState} from "react";
import {
    Alert,
    App,
    Button,
    Card,
    Col,
    Empty,
    Flex,
    Input,
    Modal,
    Popconfirm,
    Row,
    Select,
    Space,
    Table,
    Tag,
    Tooltip,
    Typography,
    theme,
} from "antd";
import type {TableColumnsType} from "antd";
import {DeleteOutlined, PlusOutlined, ReloadOutlined, SearchOutlined, WarningOutlined} from "@ant-design/icons";
import {
    type AccountProviderType,
    type AccountType,
    isAccountConnectResult,
    isAccountExpired,
    useApi,
} from "@socialjet/sdk";
import {sj} from "../../SocialJet.ts";
import ProfileImage from "../Schedules/Components/ProfileImage.tsx";
import {ADD_ACCOUNT_EVENT} from "./AddAccountActionButton.tsx";

/** Grid of the registered networks; picking one opens its connect dialog. */
function ProviderPicker(props: {
    open: boolean
    onClose: () => void
    onPick: (provider: AccountProviderType) => void
    connectedCount: (slug: string) => number
}) {
    const {token} = theme.useToken();

    return (
        <Modal open={props.open} onCancel={props.onClose} footer={null} width={560} title="Connect a social account">
            <Typography.Paragraph type="secondary">
                Pick a network. You'll use your own developer app for it — the dialog shows what to enter.
            </Typography.Paragraph>
            <Row gutter={[12, 12]}>
                {sj.getAccountProviders().map(provider => {
                    const count = props.connectedCount(provider.slug);
                    return (
                        <Col span={8} key={provider.slug}>
                            <Card
                                hoverable
                                size="small"
                                onClick={() => props.onPick(provider)}
                                styles={{body: {padding: 16}}}
                            >
                                <Flex vertical align="center" gap={8}>
                                    <span style={{fontSize: 28, color: token.colorTextSecondary}}>{provider.picture}</span>
                                    <Typography.Text strong>{provider.title}</Typography.Text>
                                    <Typography.Text type="secondary" style={{fontSize: 12}}>
                                        {count > 0 ? `${count} connected` : 'Not connected'}
                                    </Typography.Text>
                                </Flex>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </Modal>
    );
}

export const AccountsMenuPage = () => {
    const {sendRequest, loading, error} = useApi<undefined, AccountType[]>();
    const {sendRequest: deleteRequest, loading: deleting} = useApi<{ ids: number[] }, unknown>();
    const [accounts, setAccounts] = useState<AccountType[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
    const [search, setSearch] = useState("");
    const [providerFilter, setProviderFilter] = useState<string | undefined>(undefined);
    const [onlyExpired, setOnlyExpired] = useState(false);

    const [pickerOpen, setPickerOpen] = useState(false);
    const [activeProvider, setActiveProvider] = useState<AccountProviderType | undefined>(undefined);
    const [providerOpen, setProviderOpen] = useState(false);

    const {message} = App.useApp();

    const fetchAccounts = useCallback(async () => {
        const data = await sendRequest("socialjet/accounts/all");
        if (data) setAccounts(data);
        setLoaded(true);
    }, [sendRequest]);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    useEffect(() => {
        if (error) message.error(error);
    }, [error, message]);

    // OAuth popups (and token-based connect flows) report back with a `socialjet` message.
    useEffect(() => {
        const handler = (msg: MessageEvent) => {
            if (!isAccountConnectResult(msg.data)) return;

            if (msg.data.status) {
                setProviderOpen(false);
                setActiveProvider(undefined);
                setPickerOpen(false);
                fetchAccounts();
                message.success(msg.data.message);
            } else {
                message.error(msg.data.message);
            }
        };

        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, [fetchAccounts, message]);

    // "Add account" lives in the page header (see AddAccountActionButton).
    useEffect(() => {
        const open = () => setPickerOpen(true);
        window.addEventListener(ADD_ACCOUNT_EVENT, open);
        return () => window.removeEventListener(ADD_ACCOUNT_EVENT, open);
    }, []);

    const openProvider = (provider: AccountProviderType) => {
        setPickerOpen(false);
        setActiveProvider(provider);
        setProviderOpen(true);
    };

    const onReconnect = (account: AccountType) => {
        const provider = sj.getAccountProvider(account.provider);
        if (provider) openProvider(provider);
    };

    const remove = async (ids: number[], done: string) => {
        const res = await deleteRequest("socialjet/accounts/delete", {ids});
        if (res !== null) {
            message.success(done);
            setSelectedRowKeys(keys => keys.filter(k => !ids.includes(k)));
            fetchAccounts();
        }
    };

    const expiredCount = useMemo(() => accounts.filter(isAccountExpired).length, [accounts]);
    const providersInUse = useMemo(() => [...new Set(accounts.map(a => a.provider))], [accounts]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return accounts.filter(acc =>
            (!providerFilter || acc.provider === providerFilter) &&
            (!onlyExpired || isAccountExpired(acc)) &&
            (!q
                || acc.title.toLowerCase().includes(q)
                || acc.provider.toLowerCase().includes(q)
                || (sj.getAccountProvider(acc.provider)?.getAccountTypeText(acc) ?? '').toLowerCase().includes(q))
        );
    }, [accounts, search, providerFilter, onlyExpired]);

    const columns: TableColumnsType<AccountType> = [
        {
            title: "Account",
            key: "account",
            render: (_, record) => (
                <Flex align="center" gap={12}>
                    <ProfileImage account={record}/>
                    <Space direction="vertical" size={0}>
                        {record.link
                            ? <Typography.Link href={record.link} target="_blank">{record.title}</Typography.Link>
                            : <Typography.Text>{record.title}</Typography.Text>}
                        <Space size={4}>
                            <Typography.Text type="secondary">
                                {sj.getAccountProvider(record.provider)?.getAccountTypeText(record) ?? record.provider}
                            </Typography.Text>
                            {isAccountExpired(record) && (
                                <Tooltip title="This account's access has expired. Reconnect it to keep posting.">
                                    <Tag icon={<WarningOutlined/>} color="error">Expired</Tag>
                                </Tooltip>
                            )}
                        </Space>
                    </Space>
                </Flex>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 220,
            align: 'right',
            render: (_, record) => (
                <Space>
                    {isAccountExpired(record) && (
                        <Button icon={<ReloadOutlined/>} type="primary" size="small" onClick={() => onReconnect(record)}>
                            Reconnect
                        </Button>
                    )}
                    <Popconfirm
                        title={`Remove "${record.title}"?`}
                        description="Schedules stop posting to it."
                        okText="Remove"
                        okButtonProps={{danger: true}}
                        onConfirm={() => remove([record.id], "Account removed")}
                    >
                        <Button icon={<DeleteOutlined/>} danger size="small">Remove</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const isEmpty = loaded && accounts.length === 0 && !error;

    return (
        <>
            {isEmpty ? (
                <Empty
                    style={{padding: '48px 0'}}
                    description={
                        <Space direction="vertical" size={4}>
                            <Typography.Text strong>No social accounts yet</Typography.Text>
                            <Typography.Text type="secondary">
                                Connect a page, profile or channel to start sharing your posts.
                            </Typography.Text>
                        </Space>
                    }
                >
                    <Button type="primary" icon={<PlusOutlined/>} onClick={() => setPickerOpen(true)}>
                        Connect your first account
                    </Button>
                </Empty>
            ) : (
                <Space direction="vertical" size="middle" style={{width: "100%"}}>
                    {expiredCount > 0 && (
                        <Alert
                            type="warning"
                            showIcon
                            message={`${expiredCount} account${expiredCount > 1 ? 's' : ''} lost access and won't receive posts until reconnected.`}
                            action={
                                <Button size="small" onClick={() => setOnlyExpired(v => !v)}>
                                    {onlyExpired ? 'Show all' : 'Show them'}
                                </Button>
                            }
                        />
                    )}
                    <Flex justify="space-between" gap={8} wrap>
                        <Space wrap>
                            <Input
                                allowClear
                                placeholder="Search accounts"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                prefix={<SearchOutlined/>}
                                style={{width: 240}}
                            />
                            <Select
                                allowClear
                                placeholder="All networks"
                                value={providerFilter}
                                onChange={setProviderFilter}
                                style={{width: 170}}
                                options={providersInUse.map(slug => {
                                    const provider = sj.getAccountProvider(slug);
                                    return {
                                        value: slug,
                                        label: <Space size={6}>{provider?.picture}{provider?.title ?? slug}</Space>,
                                    };
                                })}
                            />
                            {selectedRowKeys.length > 0 && (
                                <Popconfirm
                                    title={`Remove ${selectedRowKeys.length} account(s)?`}
                                    okText="Remove"
                                    okButtonProps={{danger: true}}
                                    onConfirm={() => remove(selectedRowKeys, "Selected accounts removed")}
                                >
                                    <Button icon={<DeleteOutlined/>} danger loading={deleting}>
                                        Remove selected ({selectedRowKeys.length})
                                    </Button>
                                </Popconfirm>
                            )}
                        </Space>
                    </Flex>
                    <Table
                        rowKey="id"
                        loading={loading && !loaded}
                        dataSource={filtered}
                        columns={columns}
                        pagination={filtered.length > 20 ? {pageSize: 20, showSizeChanger: false} : false}
                        locale={{emptyText: loaded ? 'No accounts match these filters.' : ' '}}
                        rowSelection={{
                            selectedRowKeys,
                            onChange: keys => setSelectedRowKeys(keys as number[]),
                        }}
                    />
                </Space>
            )}

            <ProviderPicker
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onPick={openProvider}
                connectedCount={slug => accounts.filter(a => a.provider === slug).length}
            />
            {activeProvider && (
                <activeProvider.AuthModal open={providerOpen} setOpen={setProviderOpen}/>
            )}
        </>
    );
};
