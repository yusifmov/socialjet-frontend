import {Dispatch, SetStateAction, useEffect, useMemo, useState} from "react";
import {
    Avatar,
    Button,
    DatePicker,
    Empty,
    Flex,
    Input,
    Modal,
    Pagination,
    Segmented,
    Select,
    Space,
    Spin,
    Tag,
    Tooltip,
    Typography,
    theme,
} from "antd";
import {ExportOutlined, FileTextOutlined, ReloadOutlined, SearchOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import {useDispatch, useStore} from "react-redux";
import {useApi} from "@socialjet/sdk";
import {ScheduleDispatch, ScheduleState} from "../store.ts";
import ScheduledPostType from "../Types/ScheduledPostType.ts";
import {setPosts} from "../Slices/scheduleSlice.ts";
import PickerRow from "./PickerRow.tsx";

type Option<V> = { value: V, label: string, count?: number };

type PostFilters = {
    search: string
    post_type?: string
    category?: number
    date_from?: string
    date_to?: string
    orderby: string
    page: number
    per_page: number
};

const PER_PAGE = 20;

const emptyFilters = (): PostFilters => ({search: '', orderby: 'date_desc', page: 1, per_page: PER_PAGE});

const SORT_OPTIONS = [
    {value: 'date_desc', label: 'Newest first'},
    {value: 'date_asc', label: 'Oldest first'},
    {value: 'title_asc', label: 'Title A–Z'},
    {value: 'title_desc', label: 'Title Z–A'},
];

export function PostThumb({post, size = 44}: { post: ScheduledPostType, size?: number }) {
    const {token} = theme.useToken();
    // antd falls back to the icon when the image fails to load.
    return <Avatar shape="square" size={size} src={post.thumbnail || undefined} icon={<FileTextOutlined/>}
                   style={{borderRadius: token.borderRadius, background: token.colorPrimaryBg, color: token.colorPrimary, flexShrink: 0}}/>;
}

function PostPickerModal(props: { zIndex: number, open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {
    const {data, loading, error, sendRequest} = useApi<PostFilters, { posts: ScheduledPostType[], total: number }>();
    const {data: filterOptions, sendRequest: loadFilterOptions} = useApi<undefined, {
        post_types: Option<string>[],
        categories: Option<number>[]
    }>();

    const [searchInput, setSearchInput] = useState('');
    const [filters, setFilters] = useState<PostFilters>(emptyFilters);
    const [view, setView] = useState<'all' | 'selected'>('all');
    const [selectedPosts, setSelectedPosts] = useState<ScheduledPostType[]>([]);
    const dispatch = useDispatch<ScheduleDispatch>();
    const store = useStore<ScheduleState>();

    const selectedIds = useMemo(() => new Set(selectedPosts.map(p => p.id)), [selectedPosts]);
    const isSelected = (post: ScheduledPostType) => selectedIds.has(post.id);

    const toggle = (post: ScheduledPostType) => {
        setSelectedPosts(current => current.some(p => p.id === post.id)
            ? current.filter(p => p.id !== post.id)
            : [...current, post]);
    };

    const update = (patch: Partial<PostFilters>) => setFilters(f => ({...f, ...patch, page: 1}));

    const resetFilters = () => {
        setSearchInput('');
        setFilters(emptyFilters());
    };

    // Debounce typing into the search box.
    useEffect(() => {
        const t = setTimeout(() => {
            setFilters(f => f.search === searchInput ? f : {...f, search: searchInput, page: 1});
        }, 300);
        return () => clearTimeout(t);
    }, [searchInput]);

    useEffect(() => {
        if (props.open) sendRequest("socialjet/schedules/get_posts", filters);
    }, [filters, props.open, sendRequest]);

    useEffect(() => {
        if (props.open && !filterOptions) loadFilterOptions("socialjet/schedules/get_post_filters");
    }, [props.open, filterOptions, loadFilterOptions]);

    useEffect(() => {
        if (props.open) {
            setSelectedPosts(store.getState().schedule.posts);
        } else {
            setSelectedPosts([]);
            resetFilters();
            setView('all');
        }
    }, [props.open, store]);

    const pagePosts = data?.posts ?? [];
    const allOnPageSelected = pagePosts.length > 0 && pagePosts.every(isSelected);

    const toggleAllOnPage = () => {
        if (allOnPageSelected) {
            const pageIds = new Set(pagePosts.map(p => p.id));
            setSelectedPosts(current => current.filter(p => !pageIds.has(p.id)));
        } else {
            setSelectedPosts(current => [...current, ...pagePosts.filter(p => !current.some(c => c.id === p.id))]);
        }
    };

    const hasFilters = !!(filters.search || filters.post_type || filters.category || filters.date_from || filters.date_to);
    const postTypeLabel = (slug?: string) => filterOptions?.post_types.find(t => t.value === slug)?.label ?? slug;

    const onOk = () => {
        dispatch(setPosts(selectedPosts));
        props.setOpen(false);
    };

    const list = view === 'selected' ? selectedPosts : pagePosts;
    const busy = loading && view === 'all';

    return (
        <Modal
            title="Select posts"
            open={props.open}
            zIndex={props.zIndex}
            width={780}
            onCancel={() => props.setOpen(false)}
            footer={
                <Flex justify="space-between" align="center">
                    <Typography.Text type="secondary">
                        <Typography.Text strong>{selectedPosts.length}</Typography.Text> post{selectedPosts.length === 1 ? '' : 's'} selected
                        {selectedPosts.length > 0 && <Button type="link" size="small" onClick={() => setSelectedPosts([])}>Clear</Button>}
                    </Typography.Text>
                    <Space>
                        <Button onClick={() => props.setOpen(false)}>Cancel</Button>
                        <Button type="primary" onClick={onOk}>Confirm selection</Button>
                    </Space>
                </Flex>
            }
        >
            <Flex vertical gap={12}>
                <Input
                    allowClear
                    size="large"
                    prefix={<SearchOutlined style={{opacity: .5}}/>}
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    placeholder="Search posts by title or content…"
                />
                <Flex gap={8}>
                    <Select
                        allowClear
                        placeholder="All post types"
                        style={{flex: '1 1 130px', minWidth: 0}}
                        value={filters.post_type}
                        onChange={v => update({post_type: v})}
                        options={filterOptions?.post_types}
                    />
                    <Select
                        allowClear
                        showSearch
                        optionFilterProp="label"
                        placeholder="All categories"
                        style={{flex: '1 1 150px', minWidth: 0}}
                        value={filters.category}
                        onChange={v => update({category: v})}
                        options={filterOptions?.categories.map(c => ({value: c.value, label: `${c.label} (${c.count ?? 0})`}))}
                    />
                    <DatePicker.RangePicker
                        allowEmpty={[true, true]}
                        placeholder={['Published from', 'to']}
                        style={{flex: '2 1 220px', minWidth: 0}}
                        value={[
                            filters.date_from ? dayjs(filters.date_from) : null,
                            filters.date_to ? dayjs(filters.date_to) : null,
                        ]}
                        onChange={range => update({
                            date_from: range?.[0]?.format('YYYY-MM-DD'),
                            date_to: range?.[1]?.format('YYYY-MM-DD'),
                        })}
                    />
                    <Select
                        style={{flex: '1 1 130px', minWidth: 0}}
                        value={filters.orderby}
                        onChange={v => update({orderby: v})}
                        options={SORT_OPTIONS}
                    />
                </Flex>

                <Flex justify="space-between" align="center">
                    <Segmented
                        size="small"
                        value={view}
                        onChange={v => setView(v as 'all' | 'selected')}
                        options={[
                            {value: 'all', label: `Results${data ? ` (${data.total})` : ''}`},
                            {value: 'selected', label: `Selected (${selectedPosts.length})`},
                        ]}
                    />
                    {view === 'all' && (
                        <Space size={4}>
                            {hasFilters && (
                                <Button size="small" type="text" icon={<ReloadOutlined/>} onClick={resetFilters}>
                                    Reset filters
                                </Button>
                            )}
                            <Button size="small" disabled={pagePosts.length === 0} onClick={toggleAllOnPage}>
                                {allOnPageSelected ? 'Unselect all in this page' : 'Select all in this page'}
                            </Button>
                        </Space>
                    )}
                </Flex>

                <Spin spinning={busy}>
                    <div style={{height: 'min(380px, 42vh)', overflowY: 'auto', margin: '0 -4px', padding: '0 4px'}}>
                        {list.length === 0 && !busy && (
                            <Flex align="center" justify="center" style={{height: '100%'}}>
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={error ?? (view === 'selected' ? 'No posts selected yet' : 'No posts match these filters')}
                                />
                            </Flex>
                        )}
                        <Flex vertical gap={4}>
                            {list.map(post => (
                                <PickerRow
                                    key={post.id}
                                    selected={isSelected(post)}
                                    onToggle={() => toggle(post)}
                                    media={<PostThumb post={post}/>}
                                    title={post.title || '(no title)'}
                                    meta={
                                        <Space size={6} split={<span style={{opacity: .4}}>·</span>}>
                                            {post.post_type && <Tag bordered={false} style={{marginInlineEnd: 0}}>{postTypeLabel(post.post_type)}</Tag>}
                                            {post.date && <span>{post.date}</span>}
                                            <span>#{post.id}</span>
                                        </Space>
                                    }
                                    extra={
                                        <Tooltip title="Open post">
                                            <Button type="text" size="small" icon={<ExportOutlined/>} href={post.link} target="_blank"/>
                                        </Tooltip>
                                    }
                                />
                            ))}
                        </Flex>
                    </div>
                </Spin>

                {view === 'all' && (data?.total ?? 0) > PER_PAGE && (
                    <Pagination
                        size="small"
                        align="center"
                        current={filters.page}
                        pageSize={PER_PAGE}
                        total={data?.total ?? 0}
                        showSizeChanger={false}
                        onChange={page => setFilters(f => ({...f, page}))}
                    />
                )}
            </Flex>
        </Modal>
    );
}

export default PostPickerModal;
