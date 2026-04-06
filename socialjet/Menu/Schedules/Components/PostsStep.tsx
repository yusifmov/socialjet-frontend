import {FC} from "react";
import {useSelector} from "react-redux";
import {ScheduleState} from "../store.ts";
import {Button, Col, Flex, Row} from "antd";
import usePostPickerModal from "../Hooks/usePostPickerModal.tsx";
import Link from "antd/es/typography/Link";

const PostsStep: FC = () => {
    const posts = useSelector((state: ScheduleState) => state.schedule.posts);
    const {modal : PostPickerModal, setOpen: setPostsModalOpen} = usePostPickerModal();

    const add = () => {
        setPostsModalOpen(true);
    };

    return (
        <>
            {posts.length >0 && <Col>
                <Row>
                    <Col span={24}>
                        <Flex style={{
                            padding: '15px',
                        }}>
                            <Button onClick={add}>Add posts</Button>
                        </Flex>
                    </Col>
                </Row>
                <Col>
                    <Row>
                        {posts.map(p => (
                            <Col span={24} key={p.id}>
                                <Flex style={{
                                    paddingBottom: "15px",
                                    paddingLeft: "15px",
                                    paddingRight: "15px",
                                }}>
                                    <Link href={p.link} target={'_blank'}>{p.title || 'Unknown'}</Link>
                                </Flex>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Col>}
            {posts.length === 0 && <Flex align={'center'} justify={'center'} style={{height: '100%'}}>
              <Button type={'primary'}
                      onClick={add}
              >Click to select posts</Button>
            </Flex>}
            {PostPickerModal}
        </>

    );
};

export default PostsStep;