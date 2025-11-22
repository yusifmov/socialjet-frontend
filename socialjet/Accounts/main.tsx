import {FC, useEffect, useState} from "react";
import {Button, Col, Input, message, Modal, Popconfirm, Row, Space, Table, Typography} from "antd";
import {DeleteOutlined, PlusOutlined, SearchOutlined} from "@ant-design/icons";
import {sj} from "../SocialJet";
import {useApi} from "../Hooks/useApi";
import {AccountType} from "../Types/AccountType";
import ProfileImage from "../Schedules/Components/ProfileImage";
import {AccountProviderType} from "../Types/AccountProviderType.ts";
import Link from "antd/es/typography/Link";

const AccountsMenuPage: FC = () => {
    const {sendRequest, loading} = useApi<any, AccountType[]>();
    const {sendRequest: deleteRequest} = useApi<{ ids: number[] }, any>();
    const [accounts, setAccounts] = useState<AccountType[]>([]);
    const [filtered, setFiltered] = useState<AccountType[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
    const [search, setSearch] = useState("");

    const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
    const [activeProvider, setActiveProvider] = useState<AccountProviderType | undefined>(undefined)
    const [providerOpen, setProviderOpen] = useState<boolean>(false);

    const fetchAccounts = async () => {
        const data = await sendRequest("socialjet/accounts/all");
        if (data) {
            setAccounts(data);
            setFiltered(data);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    useEffect(() => {
        const handler = (msg: MessageEvent<{ status: boolean, message: string }>) => {
            if (msg.data.status) {
                setProviderOpen(false);
                setActiveProvider(undefined);
                setAuthModalOpen(false);
                fetchAccounts();
            }
            msg.data.status ? message.success(msg.data.message) : message.error(msg.data.message);
        };

        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, [activeProvider, providerOpen]);

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
            render: (_: any, record: AccountType) => (
                <Row align={'middle'} gutter={[8, 8]}>
                    <Col><ProfileImage account={record}/></Col>
                    <Col>
                        <Space direction="vertical" size={0}>
                            <Link href={record.link} target="_blank">
                                {record.title}
                            </Link>

                            <Typography.Text type="secondary">
                                {sj.getAccountProvider(record.provider).getAccountTypeText(record)}
                            </Typography.Text>
                        </Space>
                    </Col>
                </Row>
            )
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: AccountType) => (
                <Popconfirm title="Are you sure to delete?" onConfirm={() => onDelete(record.id)}>
                    <Button icon={<DeleteOutlined/>} danger size="small">Delete</Button>
                </Popconfirm>
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
                                <Button onClick={() => {
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

sj.registerMenuItem({
    title: "Accounts",
    parent: undefined,
    actions: [],
    icon: undefined,
    priority: 0,
    slug: "accounts",
    render: AccountsMenuPage
});