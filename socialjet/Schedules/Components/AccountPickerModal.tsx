import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {useApi} from "../../Hooks/useApi.ts";
import {AccountType} from "../../Types/AccountType.ts";
import {Button, Col, List, Modal, Row, Skeleton} from "antd";
import ProfileImage from "./ProfileImage.tsx";
import Link from "antd/es/typography/Link";
import store, {ScheduleDispatch} from "../store";
import {useDispatch} from "react-redux";
import {pushAccountSetting, removeAccountSetting} from "../Slices/scheduleSlice.ts";

function AccountPickerModal(props: {zIndex: number, open: boolean, setOpen: Dispatch<SetStateAction<boolean>>}) {
    const {data: accounts, loading, sendRequest} = useApi<null, AccountType[]>();

    const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);
    const dispatch = useDispatch<ScheduleDispatch>();

    const isSelected = (id: number) => selectedAccounts.includes(id);

    const select = (id: number) => {
        if(!isSelected(id)) {
            setSelectedAccounts([...selectedAccounts, id]);
        }
    };

    const unselect = (id: number) => {
        setSelectedAccounts(selectedAccounts.filter(e=> e !== id));
    };

    const onOk = () => {
        const preselected = store.getState().schedule.accountSettings.map(e => e.account.id);

        store.getState().schedule.accountSettings.forEach(accountSetting => {
            if(!selectedAccounts.includes(accountSetting.account.id)) {
                dispatch(removeAccountSetting(accountSetting))
            }
        });

        selectedAccounts.forEach((id: number) => {
            if (preselected.includes(id)) {
                return;
            }

            const account = accounts?.find(e => e.id === id);

            if(!account) {
                return;
            }

            dispatch(pushAccountSetting(account));
        });

        props.setOpen(false)
    };

    const onCancel = () => {
        props.setOpen(false);
    }

    useEffect(() => {
        if(props.open){
            sendRequest("socialjet/accounts/all");
        }
    }, [props.open]);

    useEffect(() => {
        if(props.open){
            setSelectedAccounts(store.getState().schedule.accountSettings.map(e => e.account.id))
        }
        else {
            setSelectedAccounts([])
        }
    }, [props.open]);

    return (
        <Modal onOk={onOk} onCancel={onCancel} open={props.open} zIndex={props.zIndex} closeIcon={null} okText={'Confirm selection'}>
            <Col>
                <Row style={{width: '100%'}}>
                    <Skeleton loading={loading}>
                        <List
                            style={{width: '100%', height: '400px', overflowY: 'auto'}}
                            itemLayout="horizontal"
                            dataSource={accounts || []}
                            renderItem={(account) => {
                                return (
                                    <List.Item key={account.id}>
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: "1rem",
                                            width: "100%"
                                        }}>
                                            <Row justify={"space-between"} style={{width: "100%"}}>
                                                <Col>
                                                    <Row align={'middle'} gutter={[8, 8]}>
                                                        <Col><ProfileImage account={account}/></Col>
                                                        <Col><Link href={account.link}
                                                                   target={'_blank'}>{account.title}</Link></Col>

                                                    </Row>
                                                </Col>
                                                {
                                                    isSelected(account.id)
                                                        ?<Col><Button type="default" size="small" onClick={() => unselect(account.id)}>Unselect</Button></Col>
                                                        :<Col><Button type="primary" size="small" onClick={() => select(account.id)}>Select</Button></Col>
                                                }
                                            </Row>
                                        </div>
                                    </List.Item>
                                );
                            }}
                        />
                    </Skeleton>
                </Row>
            </Col>
        </Modal>
    );
}

export default AccountPickerModal;
