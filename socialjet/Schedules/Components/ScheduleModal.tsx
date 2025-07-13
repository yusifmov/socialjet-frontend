import React from 'react';
import {Modal} from 'antd';
import AccountSettingsStep from "./AccountSettingsStep.tsx";
import PostsStep from "./PostsStep.tsx";
import ScheduleSettingsStep from "./ScheduleSettingsStep.tsx";
import {useSelector} from "react-redux";
import {ScheduleState} from "../store.ts";
import ScheduleModalContent from "./ScheduleModalContent.tsx";

const steps = [
    {
        title: 'Select Accounts',
        content: <AccountSettingsStep/>,
    },
    {
        title: 'Select Posts',
        content: <PostsStep/>,
    },
    {
        title: 'Schedule Settings',
        content: <ScheduleSettingsStep/>,
    },
];

const ScheduleModal: React.FC = () => {
    const open = useSelector((state: ScheduleState) => state.modal.open);

    return (
        <>
            <Modal open={open} closeIcon={null} footer={null} height={'600px'}>
                <ScheduleModalContent steps={steps}></ScheduleModalContent>
            </Modal>
        </>
    );
};

export default ScheduleModal;