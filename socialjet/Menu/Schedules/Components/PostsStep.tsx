import {FC} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button, Flex, Tooltip, Typography, theme} from "antd";
import {CloseOutlined, EditOutlined, ReadOutlined} from "@ant-design/icons";
import {ScheduleDispatch, ScheduleState} from "../store.ts";
import usePostPickerModal from "../Hooks/usePostPickerModal.tsx";
import {removePost} from "../Slices/scheduleSlice.ts";
import {PostThumb} from "./PostPickerModal.tsx";

const PostsStep: FC = () => {
    const {token} = theme.useToken();
    const posts = useSelector((state: ScheduleState) => state.schedule.posts);
    const {modal: PostPickerModal, setOpen: setPostsModalOpen} = usePostPickerModal();
    const dispatch = useDispatch<ScheduleDispatch>();

    if (posts.length === 0) {
        return (
            <>
                <Flex vertical align="center" justify="center" gap={12} style={{height: '100%', padding: 24, boxSizing: 'border-box', textAlign: 'center'}}>
                    <div style={{
                        width: 56, height: 56, borderRadius: '50%', display: 'grid', placeItems: 'center',
                        background: token.colorPrimaryBg, color: token.colorPrimary, fontSize: 24,
                    }}><ReadOutlined/></div>
                    <Typography.Title level={5} style={{margin: 0}}>What should be shared?</Typography.Title>
                    <Typography.Text type="secondary">Pick the posts this schedule will publish, in the order set on the next step.</Typography.Text>
                    <Button type="primary" size="large" onClick={() => setPostsModalOpen(true)}>Select posts</Button>
                </Flex>
                {PostPickerModal}
            </>
        );
    }

    return (
        <Flex vertical gap={12} style={{padding: 16}}>
            <Flex justify="space-between" align="center">
                <Typography.Text type="secondary" style={{fontSize: 12, textTransform: 'uppercase', letterSpacing: .5}}>
                    {posts.length} post{posts.length === 1 ? '' : 's'}
                </Typography.Text>
                <Button size="small" icon={<EditOutlined/>} onClick={() => setPostsModalOpen(true)}>Add or remove posts</Button>
            </Flex>
            <Flex vertical gap={6}>
                {posts.map(p => (
                    <Flex key={p.id} align="center" gap={12} style={{
                        padding: '8px 12px',
                        background: token.colorBgContainer,
                        borderRadius: token.borderRadiusLG,
                        border: `1px solid ${token.colorBorderSecondary}`,
                    }}>
                        <PostThumb post={p} size={36}/>
                        <Flex vertical style={{minWidth: 0, flex: 1}}>
                            <Typography.Link href={p.link} target="_blank" ellipsis strong>{p.title || '(no title)'}</Typography.Link>
                            <Typography.Text type="secondary" style={{fontSize: 12}}>
                                {[p.post_type, p.date, `#${p.id}`].filter(Boolean).join(' · ')}
                            </Typography.Text>
                        </Flex>
                        <Tooltip title="Remove">
                            <Button type="text" size="small" icon={<CloseOutlined/>} onClick={() => dispatch(removePost(p))}/>
                        </Tooltip>
                    </Flex>
                ))}
            </Flex>
            {PostPickerModal}
        </Flex>
    );
};

export default PostsStep;
