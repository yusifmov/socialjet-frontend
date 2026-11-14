import {
    Form,
    Input,
    Switch,
    InputNumber,
    DatePicker,
    Select,
    TimePicker,
    Space,
    Button,
    Row,
    Col,
    Card, Divider,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector, useStore } from "react-redux";
import dayjs from "dayjs";
import { WeekDaysEnum } from "../Types/WeekDaysEnum.ts";
import { ScheduleState } from "../store.ts";
import ScheduleSettingsType from "../Types/ScheduleSettingsType.ts";
import {setSettings} from "../Slices/scheduleSlice.ts";

/**
 * Timing step. The `autoposter` variant (also used by the Auto-posters page) has no
 * start date or post order: posts arrive one by one as they get published.
 */
function ScheduleSettingsStep({ variant = "schedule" }: { variant?: "schedule" | "autoposter" }) {
    const isAutoPoster = variant === "autoposter";
    const dispatch = useDispatch();
    const store = useStore<ScheduleState>();
    const scheduleSettings = useSelector((state: ScheduleState) => state.schedule.scheduleSettings);
    const [form] = Form.useForm();

    const handleChange = (changedValues: any, allValues: any) => {
        const updated: ScheduleSettingsType = { ...store.getState().schedule.scheduleSettings };

        if ("start_at" in changedValues) {
            updated.start_at = changedValues.start_at?.isValid?.()
                ? changedValues.start_at.unix()
                : null;
        }

        if ("plan" in changedValues) {
            const formattedPlan: typeof scheduleSettings.plan = {};
            for (const day in allValues.plan) {
                if (allValues.plan[day]) {
                    formattedPlan[day as WeekDaysEnum] = allValues.plan[day].map((t: any) =>
                        dayjs.isDayjs(t) ? t.format("HH:mm") : t
                    );
                }
            }
            updated.plan = formattedPlan;
        }

        if ("title" in changedValues) {
            updated.title = allValues.title;
        }

        updated.is_planned = allValues.is_planned || false;
        updated.sharing_gap = allValues.sharing_gap || 0;
        updated.post_sort = allValues.post_sort || "old_to_new";

        dispatch(setSettings(updated));
    };

    return (
        <Form
            layout="vertical"
            style={{ padding: 16 }}
            form={form}
            initialValues={{
                ...scheduleSettings,
                start_at: scheduleSettings.start_at ? dayjs.unix(scheduleSettings.start_at) : dayjs().unix(),
                plan: Object.fromEntries(
                    Object.entries(scheduleSettings.plan || {}).map(([day, times]) => [
                        day,
                        times?.map((t) => dayjs(t, "HH:mm")),
                    ])
                ),
            }}
            onValuesChange={handleChange}
        >
            <Card style={{ marginBottom: 12 }} styles={{body:{padding: 16}}}>
                <Card.Meta
                    title={isAutoPoster ? "Auto-poster Details" : "Schedule Details"}
                    description={isAutoPoster ? "Name this auto-poster so you can find it later" : "Set a title and starting time for your schedule"}
                />
                <Divider style={{ margin: '12px 0' }} />
                <Row gutter={8}>
                    <Col span={isAutoPoster ? 24 : 12}>
                        <Form.Item name="title" label="Title">
                            <Input placeholder={isAutoPoster ? "Auto-poster title (optional)" : "Schedule title (optional)"} />
                        </Form.Item>
                    </Col>
                    {!isAutoPoster && <Col span={12}>
                        <Form.Item name="start_at" label="Start At">
                            <DatePicker
                                showTime
                                format="YYYY-MM-DD HH:mm"
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </Col>}
                </Row>
            </Card>

            <Card title={null} style={{ marginBottom: 12 }} styles={{body:{padding: 16}}}>
                <Card.Meta
                    title="Planning Settings"
                    description={isAutoPoster
                        ? "New posts are shared as soon as they are published, keeping at least the gap below between shares. Enable 'Weekly planning' to share only at set times instead."
                        : "You can enable setting a weekly plan for your schedules by enabling 'Weekly planning' or just set posting interval between your posts."}
                />
                <Divider style={{ margin: '12px 0' }} />
                <Form.Item
                    name="is_planned"
                    label="Enable Weekly Planning"
                    valuePropName="checked"
                    layout={'horizontal'}
                >
                    <Switch />
                </Form.Item>

                {!scheduleSettings.is_planned && (
                    <Form.Item
                        name="sharing_gap"
                        label={isAutoPoster ? "Minimum gap between shares (minutes)" : "Posting Interval (minutes)"}
                        layout={'horizontal'}
                    >
                        <InputNumber min={isAutoPoster ? 0 : 1} style={{ width: "100%" }} />
                    </Form.Item>
                )}

                {scheduleSettings.is_planned && (
                    <>
                        <Form.Item label="Weekly Plan">
                            {Object.values(WeekDaysEnum).map((day) => (
                                <Card
                                    key={day}
                                    size="small"
                                    title={day}
                                    style={{ marginBottom: 12 }}
                                >
                                    <Form.List name={["plan", day]}>
                                        {(fields, { add, remove }) => (
                                            <Space wrap>
                                                {fields.map(({ key, name }) => (
                                                    <Space key={key} align="baseline">
                                                        <Form.Item name={name} noStyle>
                                                            <TimePicker
                                                                style={{ width: 100 }}
                                                                format="HH:mm"
                                                            />
                                                        </Form.Item>
                                                        <MinusCircleOutlined
                                                            onClick={() => remove(name)}
                                                        />
                                                    </Space>
                                                ))}
                                                <Button
                                                    size="small"
                                                    icon={<PlusOutlined />}
                                                    onClick={() => add()}
                                                >
                                                    Add Time
                                                </Button>
                                            </Space>
                                        )}
                                    </Form.List>
                                </Card>
                            ))}
                        </Form.Item>
                    </>
                )}
            </Card>

            {!isAutoPoster && <Card styles={{body:{padding: 16}}}>
                <Card.Meta title="Post Order Settings" description={"Select in what order to share posts"}/>
                <Divider style={{ margin: '12px 0' }}/>
                <Form.Item name="post_sort" label="Post Sort Order" layout={'horizontal'}>
                    <Select>
                        <Select.Option value="old_to_new">Old to New</Select.Option>
                        <Select.Option value="new_to_old">New to Old</Select.Option>
                        <Select.Option value="scramble">Scramble</Select.Option>
                    </Select>
                </Form.Item>
            </Card>}
        </Form>
    );
}

export default ScheduleSettingsStep;
