import {FC, useEffect, useState} from "react";
import {Table, Tag, Col, Space, Typography, Row} from "antd";
import dayjs from "dayjs";
import {AccountType} from "../Types/AccountType.ts";
import {useApi} from "../Hooks/useApi.ts";
import {sj} from "../SocialJet.ts";
import {HistoryItemType} from "./Types/HistoryItemType.ts";
import ProfileImage from "../Schedules/Components/ProfileImage.tsx";
import Link from "antd/es/typography/Link";

const statusColorMap: Record<string, string> = {
    Success: "green",
    Fail: "red",
    Queued: "blue",
    Sharing: "orange",
    Processing: "purple",
};

const HistoryMenuPage: FC = () => {
    const {sendRequest, loading} = useApi<{ page: number }, { items: HistoryItemType[], total: number }>();
    const [data, setData] = useState<HistoryItemType[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);

    const fetchHistory = async (page: number) => {
        const res = await sendRequest("socialjet/history/list", {page});
        if (res) {
            setData(res.items);
            setTotal(res.total);
        }
    };

    useEffect(() => {
        fetchHistory(page);
    }, [page]);

    return (
        <Table
            rowKey="id"
            loading={loading}
            dataSource={data}
            pagination={{
                total,
                pageSize: 10,
                current: page,
                onChange: setPage,
            }}
            columns={[
                {
                    title: "Account",
                    dataIndex: "account",
                    render: (account?: AccountType) => {
                        if(!account){
                            return '-';
                        }

                        const provider = sj.getAccountProvider(account.provider);

                        if(!provider){
                            return '-';
                        }

                        return <Row align={'middle'} gutter={[8, 8]}>
                            <Col><ProfileImage account={account}/></Col>
                            <Col>
                                <Space direction="vertical" size={0}>
                                    <Link href={account.link} target="_blank">
                                        {account.title}
                                    </Link>

                                    <Typography.Text type="secondary">
                                        {provider.getAccountTypeText(account)}
                                    </Typography.Text>
                                </Space>
                            </Col>
                        </Row>
                    }
                },
                {
                    title: "Schedule",
                    dataIndex: "schedule",
                    render: schedule => schedule ? `${schedule.title} (${schedule.type})` : '-'
                },
                {
                    title: "Post",
                    dataIndex: ["post", "title"],
                    render: (title?: string) => title || '-'
                },
                {
                    title: "Shared At",
                    dataIndex: "shared_at",
                    render: (timestamp?: number) => timestamp ? dayjs.unix(timestamp).format("YYYY-MM-DD HH:mm") : '-'
                },
                {
                    title: "Status",
                    dataIndex: "status",
                    render: (status: string) => <Tag color={statusColorMap[status] || "default"}>{status}</Tag>
                }
            ]}
        />
    );
};

export default HistoryMenuPage;
