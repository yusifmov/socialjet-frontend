import {ReactNode, useEffect, useState} from 'react';
import {Button, Flex, Modal, Space, Spin, Steps, Typography, theme} from 'antd';
import {ArrowLeftOutlined, ArrowRightOutlined, CheckOutlined} from "@ant-design/icons";
import {useApi} from "../../../Hooks/useApi.ts";
import {ScheduleType} from "../Types/ScheduleType.ts";
import {useDispatch, useSelector} from "react-redux";
import {ScheduleState} from "../store.ts";
import {ScheduleSaveType} from "../Types/SceduleSaveType.ts";
import dayjs from "dayjs";
import {setOpen} from "../Slices/modalSlice.ts";
import {getEmptySchedule, setSchedule} from "../Slices/scheduleSlice.ts";

function ScheduleModalContent(props: { steps: { title: string, description?: string, content: ReactNode }[] }) {
    const {token} = theme.useToken();
    const [current, setCurrent] = useState(0);
    const {data, loading, sendRequest, error} = useApi<ScheduleSaveType, number>();
    const schedule: ScheduleType = useSelector((state: ScheduleState) => state.schedule);

    const dispatch = useDispatch();

    const close = () => {
        setCurrent(0);
        dispatch(setSchedule(getEmptySchedule()));
        dispatch(setOpen(false));
    }

    useEffect(() => {
        if (data) {
            close();
        }
    }, [data]);

    useEffect(() => {
        if (error) {
            Modal.error({
                title: 'Failed to Save Schedule',
                content: error,
            });
        }
    }, [error]);

    const counts = [
        schedule.accountSettings.length ? `${schedule.accountSettings.length} selected` : undefined,
        schedule.posts.length ? `${schedule.posts.length} selected` : undefined,
        undefined,
    ];

    const items = props.steps.map((item, i) => ({
        key: item.title,
        title: item.title,
        description: counts[i] ?? item.description,
    }));

    const onSave = () => {
        if (loading) return;

        const scheduleSave: ScheduleSaveType = {
            id: schedule.id,
            type: schedule.type,
            scheduleSettings: schedule.scheduleSettings,
            accountSettings: schedule.accountSettings.map(s => {
                return {account_id: s.account.id, settings: s.settings};
            }),
            posts: schedule.posts.map(p => p.id),
            time_offset: dayjs().utcOffset()
        }

        sendRequest('socialjet/schedules/save', scheduleSave);
    }

    const isLast = current === props.steps.length - 1;

    return (
        <Spin spinning={loading}>
            {/* Fits the viewport (with the modal's padding) so the page never gets an outer scrollbar. */}
            <Flex vertical style={{height: 'min(680px, calc(100vh - 120px))', minHeight: 420}}>
                <Typography.Title level={4} style={{margin: '0 0 20px'}}>
                    {schedule.id ? 'Edit schedule' : 'New schedule'}
                </Typography.Title>
                <Steps current={current} items={items} onChange={setCurrent} size="small"/>
                <div style={{
                    marginTop: 20,
                    flex: 1,
                    minHeight: 0,
                    overflowY: 'auto',
                    borderRadius: token.borderRadiusLG,
                    border: `1px solid ${token.colorBorderSecondary}`,
                    background: token.colorBgLayout,
                }}>
                    {props.steps[current].content}
                </div>
                <Flex justify="space-between" align="center" style={{marginTop: 20}}>
                    <Button onClick={close}>Cancel</Button>
                    <Space>
                        {current > 0 && (
                            <Button icon={<ArrowLeftOutlined/>} onClick={() => setCurrent(current - 1)}>Back</Button>
                        )}
                        {!isLast && (
                            <Button type="primary" onClick={() => setCurrent(current + 1)}>
                                Next <ArrowRightOutlined/>
                            </Button>
                        )}
                        {isLast && (
                            <Button type="primary" icon={<CheckOutlined/>} onClick={onSave}>
                                {schedule.id ? 'Save changes' : 'Create schedule'}
                            </Button>
                        )}
                    </Space>
                </Flex>
            </Flex>
        </Spin>
    );
}

export default ScheduleModalContent;
