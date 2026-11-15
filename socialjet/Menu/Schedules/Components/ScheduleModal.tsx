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
        title: 'Accounts',
        description: 'Where to share',
        content: <AccountSettingsStep/>,
    },
    {
        title: 'Posts',
        description: 'What to share',
        content: <PostsStep/>,
    },
    {
        title: 'Timing',
        description: 'When to share',
        content: <ScheduleSettingsStep/>,
    },
];

const ScheduleModal: React.FC = () => {
    const open = useSelector((state: ScheduleState) => state.modal.open);

    return (
        <>
            <Modal open={open} closeIcon={null} footer={null} width={960} maskClosable={false} centered>
                <ScheduleModalContent steps={steps}></ScheduleModalContent>
            </Modal>
        </>
    );
};

export default ScheduleModal;