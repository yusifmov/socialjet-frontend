import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {useApi} from "../../Hooks/useApi.ts";
import {Button, Col, Input, List, Modal, Row, Skeleton} from "antd";
import Link from "antd/es/typography/Link";
import store, {ScheduleDispatch} from "../store";
import {useDispatch} from "react-redux";
import ScheduledPostType from "../Types/ScheduledPostType";
import {setPosts} from "../Slices/scheduleSlice.ts";

function PostPickerModal(props: {zIndex: number, open: boolean, setOpen: Dispatch<SetStateAction<boolean>>}) {
    const {data, loading, sendRequest} = useApi<{search: string}, { posts: ScheduledPostType[] }>();
    const [search, setSearch] = useState("");
    const [selectedPosts, setSelectedPosts] = useState<ScheduledPostType[]>([]);
    const dispatch = useDispatch<ScheduleDispatch>();

    const isSelected = (post: ScheduledPostType) : boolean => !!selectedPosts.find(p => p.id === post.id);

    const select = (post: ScheduledPostType) => {
        if(!isSelected(post)) {
            setSelectedPosts([...selectedPosts, post]);
        }
    };

    const unselect = (post: ScheduledPostType) => {
        setSelectedPosts(selectedPosts.filter(e=> e.id !== post.id));
    };

    const onOk = () => {
        dispatch(setPosts(selectedPosts));

        props.setOpen(false)
    };

    const onCancel = () => {
        props.setOpen(false);
    }

    useEffect(() => {
        if(props.open){
            sendRequest("socialjet/schedules/get_posts", {
                search: search
            });
        }
    }, [search]);

    useEffect(() => {
        if(props.open){
            setSelectedPosts(store.getState().schedule.posts)
        }
        else {
            setSelectedPosts([])
        }

        setSearch('');
    }, [props.open]);

    return (
        <Modal title={'Search posts'} onOk={onOk} onCancel={onCancel} open={props.open} zIndex={props.zIndex} closeIcon={null} okText={'Confirm selection'}>
            <Col>
                <Row>
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={'Type to search posts...'} />
                </Row>
                <Row style={{width: '100%'}}>
                    <Skeleton loading={loading}>
                        <List
                            style={{width: '100%', height: '400px', overflowY: 'auto'}}
                            itemLayout="horizontal"
                            dataSource={data?.posts || []}
                            renderItem={(post) => {
                                return (
                                    <List.Item key={post.id}>
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: "1rem",
                                            width: "100%"
                                        }}>
                                            <Row justify={"space-between"} style={{width: "100%"}}>
                                                <Col>
                                                    <Col><Link href={post.link}
                                                               target={'_blank'}>{post.title || 'Unknown'}</Link></Col>
                                                </Col>
                                                {
                                                    isSelected(post)
                                                        ?<Col><Button type="default" size="small" onClick={() => unselect(post)}>Unselect</Button></Col>
                                                        :<Col><Button type="primary" size="small" onClick={() => select(post)}>Select</Button></Col>
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

export default PostPickerModal;