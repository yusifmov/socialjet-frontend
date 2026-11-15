import {useCallback, useEffect, useState} from "react";
import {App, Avatar, Button, Col, Dropdown, Empty, Flex, Pagination, Popconfirm, Row, Space, Switch, Table, Tag, Tooltip, Typography} from "antd";
import type {TableColumnsType} from "antd";
import {DeleteOutlined, EditOutlined, FilterOutlined, ThunderboltOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import dayjs from "dayjs";
import {useApi} from "@socialjet/sdk";
import {AutoPosterDispatch, AutoPosterState} from "../store.ts";
import {AutoPosterType} from "../Types/AutoPosterType.ts";
import {AutoPostFilters} from "../Types/AutoPostFilters.ts";
import {openAutoPosterEditor} from "../Slices/actions.ts";
import ProfileImage from "../../Schedules/Components/ProfileImage.tsx";
import {PostThumb} from "../../Schedules/Components/PostPickerModal.tsx";

type StatusFilter = 'all' | 'active' | 'paused';

function FiltersSummary({filters}: { filters: AutoPostFilters | null }) {
    if (!filters) return <Typography.Text type="secondary">-</Typography.Text>;

    const rules = filters.include.length;
    const exclusions = filters.exclude.length;

    return (
        <Flex gap={4} wrap>
            {filters.post_types.map(pt => <Tag key={pt}>{pt}</Tag>)}
            <Typography.Text type="secondary" style={{fontSize: 12}}>
                {rules ? `${rules} rule${rules === 1 ? '' : 's'} (${filters.relation === 'and' ? 'all' : 'any'})` : 'all posts'}
                {exclusions ? `, ${exclusions} exclusion${exclusions === 1 ? '' : 's'}` : ''}
            </Typography.Text>
        </Flex>
    );
}

function RecentPosts({autoPoster}: { autoPoster: AutoPosterType }) {
    if (!autoPoster.posts.length) {
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No posts matched yet"/>;
    }

    return (
        <Flex vertical gap={6} style={{padding: '4px 0'}}>
            {autoPoster.posts.map(p => (
                <Flex key={p.id} align="center" gap={10}>
                    <PostThumb post={p} size={28}/>
                    <Typography.Link href={p.link} target="_blank" ellipsis style={{flex: 1, minWidth: 0}}>
                        {p.title || '(no title)'}
                    </Typography.Link>
                    <Tag color={p.sharing_done ? 'green' : 'gold'}>{p.sharing_done ? 'Shared' : 'Waiting'}</Tag>
                    <Typography.Text type="secondary" style={{fontSize: 12, width: 130, textAlign: 'right'}}>
                        {p.shared_at ? dayjs.unix(Number(p.shared_at)).format('YYYY-MM-DD HH:mm') : ''}
                    </Typography.Text>
                </Flex>
            ))}
        </Flex>
    );
}

function AutoPostersMenuPage() {
    const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');
    const [page, setPage] = useState(1);
    const open = useSelector((state: AutoPosterState) => state.modal.open);
    const dispatch = useDispatch<AutoPosterDispatch>();
    const {message} = App.useApp();

    const apiList = useApi<{ page: number, status: StatusFilter }, { autoposters: AutoPosterType[], total: number }>();
    const apiDelete = useApi<{ id: number }, { deleted: number }>();
    const apiToggle = useApi<{ id: number }, boolean>();

    const fetchData = useCallback(
        () => apiList.sendRequest('socialjet/autoposters/list', {page, status: filterStatus}),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [page, filterStatus]
    );

    useEffect(() => {
        // Also refreshes after the editor closes.
        if (!open) fetchData();
    }, [fetchData, open]);

    useEffect(() => {
        const error = apiList.error || apiDelete.error || apiToggle.error;
        if (error) message.error(error);
    }, [apiList.error, apiDelete.error, apiToggle.error, message]);

    const remove = async (id: number) => {
        if (await apiDelete.sendRequest('socialjet/autoposters/delete', {id})) {
            message.success('Auto-poster deleted');
            fetchData();
        }
    };

    const toggle = async (id: number) => {
        if (await apiToggle.sendRequest('socialjet/autoposters/toggle_status', {id})) {
            fetchData();
        }
    };

    const columns: TableColumnsType<AutoPosterType> = [
        {
            title: 'Title',
            key: 'title',
            render: (_, r) => <Typography.Text strong>{r.scheduleSettings.title || 'Untitled'}</Typography.Text>,
        },
        {
            title: 'Filters',
            key: 'filters',
            render: (_, r) => <FiltersSummary filters={r.filters}/>,
        },
        {
            title: 'Accounts',
            key: 'accounts',
            render: (_, r) => (
                <Avatar.Group max={{count: 4}} size={28}>
                    {r.accountSettings.filter(s => s.account).map(s => (
                        <Tooltip key={s.account.id} title={s.account.title}>
                            <span><ProfileImage account={s.account} size={28}/></span>
                        </Tooltip>
                    ))}
                </Avatar.Group>
            ),
        },
        {
            title: 'Matched',
            key: 'matched',
            render: (_, r) => (
                <Tooltip title={`${r.stats.pending} waiting to be shared`}>
                    {r.stats.matched}{r.stats.pending ? <Typography.Text type="secondary"> ({r.stats.pending} waiting)</Typography.Text> : null}
                </Tooltip>
            ),
        },
        {
            title: 'Last shared',
            key: 'last_shared',
            render: (_, r) => r.stats.last_shared_at
                ? dayjs.unix(r.stats.last_shared_at).format('YYYY-MM-DD HH:mm')
                : <Typography.Text type="secondary">Never</Typography.Text>,
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, r) => (
                <Tooltip title={r.status === 'active' ? 'Pause: new posts are not picked up while paused' : 'Activate'}>
                    <Switch checked={r.status === 'active'} checkedChildren="Active" unCheckedChildren="Paused"
                            loading={apiToggle.loading} onChange={() => toggle(r.id)}/>
                </Tooltip>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, r) => (
                <Space>
                    <Popconfirm title="Delete this auto-poster?" description="Posts it hasn't shared yet are dropped."
                                onConfirm={() => remove(r.id)}>
                        <Tooltip title="Delete"><Button icon={<DeleteOutlined/>} danger/></Tooltip>
                    </Popconfirm>
                    <Tooltip title="Edit">
                        <Button icon={<EditOutlined/>} onClick={() => openAutoPosterEditor(dispatch, r)}/>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const statusItems = [
        {label: 'All', key: 'all'},
        {label: 'Active', key: 'active'},
        {label: 'Paused', key: 'paused'},
    ];

    return (
        <Col style={{padding: 20}}>
            <Row justify="space-between" align="middle" style={{marginBottom: 10}}>
                <Col>
                    <Dropdown trigger={['click']} menu={{
                        items: statusItems,
                        onClick: e => {
                            setFilterStatus(e.key as StatusFilter);
                            setPage(1);
                        },
                    }}>
                        <Button icon={<FilterOutlined/>}>
                            Filter: {statusItems.find(i => i.key === filterStatus)?.label}
                        </Button>
                    </Dropdown>
                </Col>
            </Row>
            <Table<AutoPosterType>
                rowKey="id"
                columns={columns}
                dataSource={apiList.data?.autoposters ?? []}
                loading={apiList.loading || apiDelete.loading}
                pagination={false}
                expandable={{
                    expandedRowRender: r => <RecentPosts autoPoster={r}/>,
                    rowExpandable: r => r.stats.matched > 0,
                }}
                locale={{
                    emptyText: (
                        <Empty image={<ThunderboltOutlined style={{fontSize: 40, opacity: .4}}/>}
                               styles={{image: {height: 48}}}
                               description="Auto-posters share new posts automatically when they match your filters."/>
                    ),
                }}
            />
            <Pagination
                current={page}
                pageSize={10}
                total={apiList.data?.total ?? 0}
                onChange={setPage}
                hideOnSinglePage
                style={{marginTop: 16, textAlign: 'right'}}
            />
        </Col>
    );
}

export default AutoPostersMenuPage;
