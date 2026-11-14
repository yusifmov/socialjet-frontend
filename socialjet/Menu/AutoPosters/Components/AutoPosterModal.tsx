import {useEffect, useState} from 'react';
import {Button, Flex, Modal, Space, Spin, Steps, Typography, theme} from 'antd';
import {ArrowLeftOutlined, ArrowRightOutlined, CheckOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import dayjs from "dayjs";
import {useApi} from "@socialjet/sdk";
import AccountSettingsStep from "../../Schedules/Components/AccountSettingsStep.tsx";
import ScheduleSettingsStep from "../../Schedules/Components/ScheduleSettingsStep.tsx";
import FiltersStep from "./FiltersStep.tsx";
import {AutoPosterDispatch, AutoPosterState} from "../store.ts";
import {AutoPosterSaveType} from "../Types/AutoPosterType.ts";
import {closeAutoPosterEditor} from "../Slices/actions.ts";

const steps = [
    {title: 'Accounts', description: 'Where to share', content: <AccountSettingsStep/>},
    {title: 'Filters', description: 'Which new posts', content: <FiltersStep/>},
    {title: 'Timing', description: 'When to share', content: <ScheduleSettingsStep variant="autoposter"/>},
];

function AutoPosterModalContent() {
    const {token} = theme.useToken();
    const [current, setCurrent] = useState(0);
    const {loading, sendRequest, error} = useApi<AutoPosterSaveType, { id: number }>();
    const schedule = useSelector((state: AutoPosterState) => state.schedule);
    const filters = useSelector((state: AutoPosterState) => state.filters);
    const dispatch = useDispatch<AutoPosterDispatch>();

    const close = () => {
        setCurrent(0);
        closeAutoPosterEditor(dispatch);
    };

    useEffect(() => {
        if (error) {
            Modal.error({title: 'Failed to save auto-poster', content: error});
        }
    }, [error]);

    const ruleCount = filters.include.length + filters.exclude.length;
    const counts = [
        schedule.accountSettings.length ? `${schedule.accountSettings.length} selected` : undefined,
        ruleCount ? `${ruleCount} rule${ruleCount === 1 ? '' : 's'}` : undefined,
        undefined,
    ];

    const items = steps.map((item, i) => ({
        key: item.title,
        title: item.title,
        description: counts[i] ?? item.description,
    }));

    const onSave = async () => {
        if (loading) return;

        const {title, is_planned, sharing_gap, plan} = schedule.scheduleSettings;
        const stripKey = (rule: typeof filters.include[number]) => {
            const copy = {...rule};
            delete copy.key;
            return copy;
        };

        const saved = await sendRequest('socialjet/autoposters/save', {
            id: schedule.id,
            // Rule keys only exist client-side.
            filters: {...filters, include: filters.include.map(stripKey), exclude: filters.exclude.map(stripKey)},
            scheduleSettings: {title, is_planned, sharing_gap, plan},
            accountSettings: schedule.accountSettings.map(s => ({account_id: s.account.id, settings: s.settings})),
            time_offset: dayjs().utcOffset(),
        });

        if (saved) close();
    };

    const isLast = current === steps.length - 1;

    return (
        <Spin spinning={loading}>
            {/* Fits the viewport (with the modal's padding) so the page never gets an outer scrollbar. */}
            <Flex vertical style={{height: 'min(680px, calc(100vh - 120px))', minHeight: 420}}>
                <Typography.Title level={4} style={{margin: '0 0 20px'}}>
                    {schedule.id ? 'Edit auto-poster' : 'New auto-poster'}
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
                    {steps[current].content}
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
                                {schedule.id ? 'Save changes' : 'Create auto-poster'}
                            </Button>
                        )}
                    </Space>
                </Flex>
            </Flex>
        </Spin>
    );
}

function AutoPosterModal() {
    const open = useSelector((state: AutoPosterState) => state.modal.open);

    return (
        <Modal open={open} closeIcon={null} footer={null} width={960} maskClosable={false} centered destroyOnHidden>
            <AutoPosterModalContent/>
        </Modal>
    );
}

export default AutoPosterModal;
