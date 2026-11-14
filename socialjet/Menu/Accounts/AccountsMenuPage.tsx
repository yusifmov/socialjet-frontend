import {useCallback, useEffect, useState} from "react";
import {App, Button, Col, Input, Modal, Popconfirm, Row, Space, Table, Tag, Tooltip, Typography} from "antd";
import {DeleteOutlined, PlusOutlined, ReloadOutlined, SearchOutlined, WarningOutlined} from "@ant-design/icons";
import {sj} from "../../SocialJet.ts";
import {useApi} from "../../Hooks/useApi.ts";
import {AccountType} from "../../Types/AccountType.ts";
import ProfileImage from "../Schedules/Components/ProfileImage.tsx";
import {AccountProviderType} from "../../Types/AccountProviderType.ts";

export const AccountsMenuPage = () => {
    const {sendRequest, loading, error} = useApi<any, AccountType[]>();
    const {sendRequest: deleteRequest} = useApi<{ ids: number[] }, any>();
    const [accounts, setAccounts] = useState<AccountType[]>([]);
    const [filtered, setFiltered] = useState<AccountType[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
    const [search, setSearch] = useState("");

    const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
    const [activeProvider, setActiveProvider] = useState<AccountProviderType | undefined>(undefined)
    const [providerOpen, setProviderOpen] = useState<boolean>(false);

    const {message} = App.useApp()

    // `is_expired` arrives from WP as the string "0"/"1", and "0" is truthy in
    // JS — so compare numerically rather than relying on truthiness.
    const isExpired = (account: AccountType) => Number(account.is_expired) === 1;

    const onReconnect = (account: AccountType) => {
        const provider = sj?.getAccountProvider(account.provider);
        if (!provider) return;
        setActiveProvider(provider);
        setProviderOpen(true);
    };

    const fetchAccounts = useCallback(async () => {
        if(!sendRequest) return;
        const data = await sendRequest("socialjet/accounts/all");
        if (data) {
            setAccounts(data);
            setFiltered(data);
        }
    }, [sendRequest]);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    useEffect(() => {
        if (error) message.error(error);
    }, [error, message]);

    useEffect(() => {
        const handler = (msg: MessageEvent) => {
            const data = msg?.data;

            // Ignore the many unrelated postMessage events on a WP admin page
            // (browser, other plugins, devtools, Vite HMR…). Only react to our
            // own OAuth-result messages, which carry the `socialjet` marker.
            if (!data || typeof data !== 'object' || data.source !== 'socialjet') {
                return;
            }

            if (data.status) {
                setProviderOpen(false);
                setActiveProvider(undefined);
                setAuthModalOpen(false);
                fetchAccounts();
                message.success(data.message);
            } else {
                message.error(data.message);
            }
        };

        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, [fetchAccounts, message]);

    const onDelete = async (id: number) => {
        const res = await deleteRequest("socialjet/accounts/delete", {ids: [id]});
        if (res !== null) {
            message.success("Account deleted");
            fetchAccounts();
        }
    };

    const onBulkDelete = async () => {
        const res = await deleteRequest("socialjet/accounts/delete", {ids: selectedRowKeys});
        if (res !== null) {
            message.success("Selected accounts deleted");
            setSelectedRowKeys([]);
            fetchAccounts();
        }
    };

    const columns = [
        {
            title: "Account",
            key: "account",
            render: (_: number, record: AccountType) => (
                <Row align={'middle'} gutter={[8, 8]}>
                    <Col><ProfileImage account={record}/></Col>
                    <Col>
                        <Space direction="vertical" size={0}>
                            <Typography.Link href={record.link} target="_blank">
                                {record.title}
                            </Typography.Link>

                            <Space size={4}>
                                <Typography.Text type="secondary">
                                    {sj?.getAccountProvider(record.provider)?.getAccountTypeText(record)}
                                </Typography.Text>
                                {isExpired(record) && (
                                    <Tooltip title="This account's access has expired. Reconnect it to keep posting.">
                                        <Tag icon={<WarningOutlined/>} color="error">Expired</Tag>
                                    </Tooltip>
                                )}
                            </Space>
                        </Space>
                    </Col>
                </Row>
            )
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: number, record: AccountType) => (
                <Space>
                    {isExpired(record) && (
                        <Button icon={<ReloadOutlined/>} type="primary" size="small"
                                onClick={() => onReconnect(record)}>
                            Reconnect
                        </Button>
                    )}
                    <Popconfirm title="Are you sure to delete?" onConfirm={() => onDelete(record.id)}>
                        <Button icon={<DeleteOutlined/>} danger size="small">Delete</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <>
            <Space direction="vertical" style={{width: "100%"}}>
                <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                    <Space>
                        <Input
                            placeholder="Search by title, provider, or type"
                            value={search}
                            onChange={e => {
                                const value = e.target.value;
                                setSearch(value);
                                setFiltered(
                                    accounts.filter(acc =>
                                        acc.title.toLowerCase().includes(value.toLowerCase()) ||
                                        acc.provider.toLowerCase().includes(value.toLowerCase()) ||
                                        (acc.type?.toLowerCase().includes(value.toLowerCase()) ?? false)
                                    )
                                );
                            }}
                            prefix={<SearchOutlined />}
                        />
                        {selectedRowKeys.length > 0 && (
                            <Popconfirm title="Delete selected accounts?" onConfirm={onBulkDelete}>
                                <Button icon={<DeleteOutlined/>} danger>Delete Selected</Button>
                            </Popconfirm>
                        )}
                    </Space>
                    <Button type="primary" icon={<PlusOutlined/>} size={'middle'}
                            onClick={() => setAuthModalOpen(true)}>
                        Add account
                    </Button>
                </div>
                <Table
                    rowKey="id"
                    loading={loading}
                    dataSource={filtered}
                    columns={columns}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: (selectedKeys: any) => setSelectedRowKeys(selectedKeys),
                    }}
                />
            </Space>
            <Modal open={authModalOpen} onCancel={() => setAuthModalOpen(false)} footer={null}>
                <h3>Select a provider to connect</h3>
                <Space direction="vertical" style={{width: '100%'}}>
                    {sj.getAccountProviders().map(provider => {
                        return (
                            <div key={provider.slug}>
                                <Button icon={provider.picture} onClick={() => {
                                    setProviderOpen(true);
                                    setActiveProvider(provider)
                                }}>{provider.title}</Button>
                            </div>
                        );
                    })}
                </Space>
            </Modal>
            {activeProvider && (
                <activeProvider.AuthModal
                    open={providerOpen}
                    setOpen={setProviderOpen}
                />
            )}
        </>
    );
};