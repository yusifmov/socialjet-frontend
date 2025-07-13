import {FC, useEffect, useState} from "react";
import {Table, Avatar, Tag} from "antd";
import dayjs from "dayjs";
import {AccountType} from "../Types/AccountType.ts";
import {useApi} from "../Hooks/useApi.ts";
import {sj} from "../SocialJet.ts";
import {HistoryItemType} from "./Types/HistoryItemType.ts";

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
                    render: (account?: AccountType) => (
                        account ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Avatar src={account.picture} /> {account.title}
                            </span>
                        ) : '-'
                    )
                },
                {
                    title: "Provider",
                    dataIndex: ["account", "provider"],
                    render: (provider: string) => (provider && sj.getAccountProvider(provider)?.title) || '-'
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
