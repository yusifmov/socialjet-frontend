import {FC, KeyboardEvent, MouseEvent, useEffect, useState} from 'react';
import {Button, Flex, Tabs, Tooltip, Typography} from 'antd';
import {PlusOutlined} from "@ant-design/icons";
import useAccountPickerModal from "../Hooks/useAccountPickerModal.tsx";
import {useDispatch, useSelector} from "react-redux";
import {ScheduleDispatch, ScheduleState} from "../store.ts";
import AccountSettingType from "../Types/AccountSettingType.ts";
import {sj} from "../../../SocialJet.ts";
import ProfileImage from "./ProfileImage.tsx";
import {removeAccountSetting, updateAccountSetting} from "../Slices/scheduleSlice.ts";

type TargetKey = MouseEvent | KeyboardEvent | string;

const AccountSettingsStep: FC = () => {
    const [activeKey, setActiveKey] = useState<string | undefined>(undefined);
    const accountSettings = useSelector((state: ScheduleState) => state.schedule.accountSettings);
    const {modal: AccountPickerModal, setOpen: setAccountsModalOpen} = useAccountPickerModal();
    const dispatch = useDispatch<ScheduleDispatch>();

    const buildAccountSettingsTab = (accountSettings: AccountSettingType, dispatch: ScheduleDispatch) => {
        const account = accountSettings.account;
        const settingsItems = sj.getSettingsItems();
        const isActive = activeKey == account.id.toString();

        return {
            closable: false,
            label: (
                <div>
                    <ProfileImage account={account}
                                  active={isActive}
                                  showCloseIcon={true}
                                  onClose={() => remove(account.id.toString())}
                    />
                </div>
            ),
            children: Object.values(settingsItems)
                .filter(
                    s => s.targets.includes('schedule') &&
                        sj.getAccountProvider(account.provider)?.supportsSetting(account, s)
                )
                .map(s => (
                    <div key={s.provider + ':' + s.slug} style={{ marginBottom: '1.5em', padding: '6px' }}>
                        <Typography.Text strong style={{display: 'block', marginBottom: 2}}>{s.title}</Typography.Text>
                        <Typography.Text type="secondary" style={{display: 'block', marginBottom: 8}}>{s.description}</Typography.Text>
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


    const onChange = (newActiveKey: string) => {
        setActiveKey(newActiveKey);
    };

    const add = () => {
        setAccountsModalOpen(true);
    };

    const remove = (targetKey: TargetKey) => {
        if (targetKey == activeKey) {
            // Move to a tab that is not the one being removed.
            const next = accountSettings.find(e => e.account.id.toString() != targetKey);
            setActiveKey(next?.account.id.toString());
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
        const exists = accountSettings.some(s => s.account.id.toString() == activeKey);
        if (!exists) setActiveKey(accountSettings[0]?.account.id.toString())
    }, [accountSettings, activeKey]);

    const settingItems = accountSettings.map(s => buildAccountSettingsTab(s, dispatch));

    return (
        <>
            {accountSettings.length > 0 && <Tabs
                tabBarStyle={{
                    border: 'none',
                }}
                onEmptied={add}
                type="editable-card"
                onChange={onChange}
                activeKey={activeKey}
                onEdit={onEdit}
                items={settingItems}
                addIcon={<Tooltip title={'Click to select accounts'}><PlusOutlined size={48}/></Tooltip>}
            />}
            {accountSettings.length === 0 && <Flex align={'center'} justify={'center'} style={{height: '100%'}}>
              <Button type={'primary'}
                      onClick={() => setAccountsModalOpen(true)}
              >Click to select accounts</Button>
            </Flex>}
            {AccountPickerModal}
        </>

    );
};

export default AccountSettingsStep;