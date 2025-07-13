import {FC} from "react";
import {useSelector} from "react-redux";
import {ScheduleState} from "../store";
import {Button, Col, Row} from "antd";
import usePostPickerModal from "../Hooks/usePostPickerModal";
import Link from "antd/es/typography/Link";

const PostsStep: FC = () => {
    const posts = useSelector((state: ScheduleState) => state.schedule.posts);
    const {modal : PostPickerModal, setOpen: setPostsModalOpen} = usePostPickerModal();

    const add = () => {
        setPostsModalOpen(true);
    };

    return (
        <>
            <Col>
                <Row><Button onClick={add}>Add posts</Button></Row>
                <Col>
                    {posts.map(p => <Row><Link href={p.link} target={'_blank'}>{p.title || 'Unknown'}</Link></Row>)}
                </Col>
            </Col>
            {PostPickerModal}
        </>

    );
};

export default PostsStep;