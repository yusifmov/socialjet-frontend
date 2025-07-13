import {CSSProperties, ReactNode, useEffect, useState} from 'react';
import {Button, Col, Modal, Spin, Steps, theme} from 'antd';
import {useApi} from "../../Hooks/useApi";
import {ScheduleType} from "../Types/ScheduleType";
import {useDispatch, useSelector} from "react-redux";
import {ScheduleState} from "../store";
import {ScheduleSaveType} from "../Types/SceduleSaveType";
import dayjs from "dayjs";
import {setOpen} from "../Slices/modalSlice";
import {getEmptySchedule,  setSchedule} from "../Slices/scheduleSlice.ts";

function ScheduleModalContent(props: { steps: { title: string, content: ReactNode }[] }) {
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


    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const items = props.steps.map((item) => ({key: item.title, title: item.title}));

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

    const onCancel = () => {
        close();
    }

    const contentStyle: CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        // backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 16,
        flexGrow: 1,
        overflowY: 'auto'
    };

    return (
        <Spin spinning={loading}>
            <Col style={{
                boxSizing: 'border-box',
                width: '100%',
                height: '600px',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Steps current={current} items={items}/>
                <div style={contentStyle}>{props.steps[current].content}</div>
                <div style={{marginTop: 24, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <div>
                        {current < props.steps.length - 1 && (
                            <Button type="primary" onClick={() => next()}>
                                Next
                            </Button>
                        )}
                        {current === props.steps.length - 1 && (
                            <Button type="primary" onClick={onSave}>
                                Done
                            </Button>
                        )}
                        {current > 0 && (
                            <Button style={{margin: '0 8px'}} onClick={() => prev()}>
                                Previous
                            </Button>
                        )}
                    </div>
                    <Button style={{margin: '0 8px'}} onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </Col>
        </Spin>
    );
}

export default ScheduleModalContent;