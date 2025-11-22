import {FC, JSX, KeyboardEvent, MouseEvent, useEffect, useState} from 'react';
import {Badge, Button, Tabs} from 'antd';
import {BellOutlined, PlusOutlined} from "@ant-design/icons";
import useAccountPickerModal from "../Hooks/useAccountPickerModal";
import {useDispatch, useSelector} from "react-redux";
import {ScheduleDispatch, ScheduleState} from "../store";
import AccountSettingType from "../Types/AccountSettingType";
import {sj} from "../../SocialJet";
import ProfileImage from "./ProfileImage";
import {removeAccountSetting, updateAccountSetting} from "../Slices/scheduleSlice.ts";

type TargetKey = MouseEvent | KeyboardEvent | string;

const initialItems = [
    {
        label: <div style={{padding: "10px"}}>
            <BellOutlined/> <Badge count={5} offset={[5, -5]}>Notifications</Badge>
        </div>, children: 'Content of Tab 1', key: '1'
    },
    {label: 'Tab 2', children: 'Content of Tab 2', key: '2'},
    {
        label: 'Tab 3',
        children: 'Content of Tab 3',
        key: '3',
        closable: false,
    },
];

const buildAccountSettingsTab = (accountSettings: AccountSettingType, dispatch: ScheduleDispatch) => {
    const account = accountSettings.account;
    const settingsItems = sj.getSettingsItems();

    return {
        label: (
            <div>
                <ProfileImage account={account} />
                {account.title}
            </div>
        ),
        children: settingsItems
            .filter(
                s => s.targets.includes('schedule') &&
                    sj.getAccountProvider(account.provider).supportsSetting(account, s)
            )
            .map(s => (
                <div key={s.provider + ':' + s.slug} style={{ marginBottom: '1.5em' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.3em' }}>{s.title}</div>
                    <div style={{ fontSize: '0.9em', color: '#888', marginBottom: '0.6em' }}>{s.description}</div>
                    {s.render({
                        setValue: value => {
                            dispatch(updateAccountSetting({
                                account_id: accountSettings.account.id,
                                value,
                                setting_key: s.provider + ':' + s.slug
                            }));
                        },
                        value: accountSettings.settings[s.provider + ':' + s.slug]
                    })}
                </div>
            )),
        key: account.id.toString()
    };
};

const AccountSettingsStep: FC = () => {
    const [activeKey, setActiveKey] = useState(initialItems[0].key);
    const accountSettings = useSelector((state: ScheduleState) => state.schedule.accountSettings);
    const {modal: AccountPickerModal, setOpen: setAccountsModalOpen} = useAccountPickerModal();
    const dispatch = useDispatch<ScheduleDispatch>();

    const [settingItems, setSettingItems] = useState<{ label: JSX.Element; children: React.ReactNode[]; key: string }[]>([]);

    const onChange = (newActiveKey: string) => {
        setActiveKey(newActiveKey);
    };

    const add = () => {
        setAccountsModalOpen(true);
    };

    const remove = (targetKey: TargetKey) => {
        if (targetKey == activeKey) {
            setActiveKey(accountSettings[0].account.id.toString())
        }

        const setting = accountSettings.find(e => e.account.id.toString() == targetKey);

        if (setting) {
            dispatch(removeAccountSetting(setting))
        }
    };

    const onEdit = (
        targetKey: MouseEvent | KeyboardEvent | string,
        action: 'add' | 'remove',
    ) => {
        if (action === 'add') {
            add();
        } else {
            remove(targetKey);
        }
    };

    useEffect(() => {
        setSettingItems(accountSettings.map(s => buildAccountSettingsTab(s, dispatch)))
    }, [accountSettings]);

    return (
        <>
            <Tabs
                type="editable-card"
                onChange={onChange}
                activeKey={activeKey}
                onEdit={onEdit}
                items={settingItems}
                addIcon={<Button icon={<PlusOutlined />}>select accounts</Button>}
            />
            {AccountPickerModal}
        </>

    );
};

export default AccountSettingsStep;