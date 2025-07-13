import React, { useEffect, useState } from "react";
import {
    Button,
    Col,
    Dropdown,
    Pagination,
    Row,
    Space,
    Table,
    Tag,
    Tooltip,
    Switch,
    message
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    DeleteOutlined,
    EditOutlined,
    FilterOutlined
} from "@ant-design/icons";
import { ScheduleType } from "../Types/ScheduleType";
import { useApi } from "../../Hooks/useApi";
import { useDispatch, useSelector } from "react-redux";
import { ScheduleDispatch, ScheduleState } from "../store";
import { setOpen } from "../Slices/modalSlice.ts";
import { setSchedule } from "../Slices/scheduleSlice.ts";

interface RowType extends ScheduleType {
    key: string;
}

function SchedulesMenuPage() {
    const [data, setData] = useState<RowType[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [filterStatus, setFilterStatus] = useState<string>('active');
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const open = useSelector((state: ScheduleState) => state.modal.open);

    const apiList = useApi<{ page: number; status: string }, { schedules: ScheduleType[], total: number }>();
    const apiDelete = useApi<{ id: number }, boolean>();
    const apiToggle = useApi<{ id: number }, boolean>();

    const dispatch = useDispatch<ScheduleDispatch>();

    const fetchData = async () => {
        const response = await apiList.sendRequest('socialjet/schedules/list', {
            page,
            status: filterStatus === 'all' ? '' : filterStatus
        });
        if (response && response.schedules) {
            const withKeys = response.schedules.map((s, index) => ({
                ...s,
                key: s.id?.toString() ?? `row-${index}`,
                status: s.status,
            }));
            setData(withKeys);
            setTotal(response.total);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, filterStatus, open]);

    const deleteSchedule = async (id?: number) => {
        if (!id) return;
        const res = await apiDelete.sendRequest(`socialjet/schedules/delete`, { id });
        if (res) {
            message.success("Deleted");
            fetchData();
        }
    };

    const bulkDelete = async () => {
        for (const k of selectedRowKeys) {
            const s = data.find(d => d.key === k);
            if (s?.id) await apiDelete.sendRequest(`socialjet/schedules/delete`, { id: s.id });
        }
        message.success("Selected schedules deleted");
        fetchData();
    };

    const toggleStatus = async (id?: number, currentStatus?: string) => {
        if (!id || currentStatus === 'done') return;
        const res = await apiToggle.sendRequest(`socialjet/schedules/toggle_status`, { id });
        if (res) {
            message.success("Status updated");
            fetchData();
        }
    };

    const columns: ColumnsType<RowType> = [
        {
            title: 'Title',
            dataIndex: 'scheduleSettings',
            key: 'title',
            render: (s) => s.title || 'Untitled'
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Accounts',
            dataIndex: 'accountSettings',
            key: 'accountSettings',
            render: (settings) => settings.length
        },
        {
            title: 'Posts',
            dataIndex: 'posts',
            key: 'posts',
            render: (posts) => posts.length
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                (status === 'active' || status === 'paused') ? (
                    <Tooltip title={status === 'active' ? "Pause Schedule" : "Activate Schedule"}>
                        <Switch
                            checked={status === 'active'}
                            checkedChildren="Active"
                            unCheckedChildren="Paused"
                            onChange={() => toggleStatus(record.id, status)}
                        />
                    </Tooltip>
                ) : (
                    <Tag color={status === 'done' ? 'blue' : 'default'}>
                        {status}
                    </Tag>
                )
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Delete">
                        <Button icon={<DeleteOutlined />} danger onClick={() => deleteSchedule(record.id)} />
                    </Tooltip>
                    {record.status === 'done' || <Tooltip title="Edit">
                      <Button icon={<EditOutlined />} onClick={() => {
                          dispatch(setSchedule(record));
                          dispatch(setOpen(true));
                      }} />
                    </Tooltip>}
                </Space>
            )
        }
    ];

    const items = [
        { label: 'All', key: 'all' },
        { label: 'Active', key: 'active' },
        { label: 'Paused', key: 'paused' },
        { label: 'Done', key: 'done' },
    ];

    return (
        <Col style={{ padding: 20 }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 10 }}>
                <Col>
                    <Dropdown
                        menu={{
                            items,
                            onClick: (e) => {
                                setFilterStatus(e.key);
                                setPage(1);
                            }
                        }}
                        trigger={['click']}
                    >
                        <Button icon={<FilterOutlined />}>
                            Filter: {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                        </Button>
                    </Dropdown>
                </Col>
                <Col>
                    {selectedRowKeys.length > 0 && (
                        <Button danger onClick={bulkDelete} icon={<DeleteOutlined />}>
                            Delete Selected
                        </Button>
                    )}
                </Col>
            </Row>
            <Table
                rowSelection={{
                    selectedRowKeys,
                    onChange: setSelectedRowKeys
                }}
                columns={columns}
                dataSource={data}
                loading={apiList.loading || apiToggle.loading || apiDelete.loading}
                pagination={false}
            />
            <Pagination
                current={page}
                pageSize={10}
                total={total}
                onChange={(p) => setPage(p)}
                style={{ marginTop: 16, textAlign: 'right' }}
            />
        </Col>
    );
}

export default SchedulesMenuPage;