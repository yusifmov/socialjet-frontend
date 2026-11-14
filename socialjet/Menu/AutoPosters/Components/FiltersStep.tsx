import {FC, ReactNode, useEffect, useMemo, useState} from "react";
import {Alert, Button, Card, Divider, Empty, Flex, Segmented, Select, Spin, Tooltip, Typography, theme} from "antd";
import {CloseOutlined, ExperimentOutlined, PlusOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {useApi} from "@socialjet/sdk";
import {AutoPosterDispatch, AutoPosterState} from "../store.ts";
import {addRule, removeRule, setPostTypes, setRelation, updateRule} from "../Slices/filtersSlice.ts";
import {AutoPostFilters, FilterOptions, FilterRule, FilterRuleType, OPERATORS} from "../Types/AutoPostFilters.ts";
import ScheduledPostType from "../../Schedules/Types/ScheduledPostType.ts";
import {PostThumb} from "../../Schedules/Components/PostPickerModal.tsx";
import TermSelect from "./TermSelect.tsx";

type RuleList = 'include' | 'exclude';
type TaxonomyOption = { value: string, label: string };

const FIXED_FIELDS: { value: FilterRuleType, label: string }[] = [
    {value: 'author', label: 'Author'},
    {value: 'featured_image', label: 'Featured image'},
    {value: 'title', label: 'Title'},
    {value: 'password_protected', label: 'Password protection'},
];

/** Field select value: `taxonomy:<name>` for taxonomy rules, the rule type otherwise. */
const fieldOf = (rule: FilterRule) => rule.type === 'taxonomy' ? `taxonomy:${rule.taxonomy}` : rule.type;

const ruleForField = (field: string): FilterRule => {
    if (field.startsWith('taxonomy:')) {
        return {type: 'taxonomy', taxonomy: field.slice(9), operator: 'any', values: []};
    }
    const type = field as FilterRuleType;
    const needsValues = type === 'author' || type === 'title';
    return {type, operator: OPERATORS[type][0].value, ...(needsValues ? {values: []} : {})};
};

const isIncomplete = (rule: FilterRule) => Array.isArray(rule.values) && rule.values.length === 0;

function RuleRow(props: {
    rule: FilterRule,
    list: RuleList,
    taxonomies: TaxonomyOption[],
    options: FilterOptions,
}) {
    const {rule, list} = props;
    const dispatch = useDispatch<AutoPosterDispatch>();
    const update = (changes: Partial<FilterRule>) =>
        dispatch(updateRule({list, key: rule.key!, rule: {...rule, ...changes}}));

    const fieldOptions = [
        {
            label: 'Taxonomies',
            options: [
                ...props.taxonomies.map(t => ({value: `taxonomy:${t.value}`, label: t.label})),
                // A taxonomy the selected post types no longer have stays visible until removed.
                ...(rule.type === 'taxonomy' && !props.taxonomies.some(t => t.value === rule.taxonomy)
                    ? [{value: fieldOf(rule), label: rule.taxonomy ?? ''}] : []),
            ],
        },
        {label: 'Post', options: FIXED_FIELDS},
    ].filter(group => group.options.length);

    const status = isIncomplete(rule) ? 'warning' as const : undefined;

    let valueControl = null;
    if (rule.type === 'taxonomy' && rule.taxonomy) {
        valueControl = <TermSelect taxonomy={rule.taxonomy} value={(rule.values ?? []) as number[]}
                                   onChange={values => update({values})} status={status}/>;
    } else if (rule.type === 'author') {
        valueControl = <Select<number[]> mode="multiple" value={(rule.values ?? []) as number[]} status={status}
                                         onChange={values => update({values})} options={props.options.authors}
                                         optionFilterProp="label" placeholder="Select authors…"
                                         style={{width: '100%'}} maxTagCount="responsive"/>;
    } else if (rule.type === 'title') {
        valueControl = <Select<string[]> mode="tags" value={(rule.values ?? []) as string[]} status={status}
                                         onChange={values => update({values})} open={false}
                                         tokenSeparators={[',']} placeholder="Type a keyword and press Enter"
                                         style={{width: '100%'}}/>;
    }

    return (
        <Flex gap={8} align="start" wrap>
            <Select value={fieldOf(rule)} options={fieldOptions} style={{width: 180}}
                    onChange={field => dispatch(updateRule({list, key: rule.key!, rule: ruleForField(field)}))}/>
            <Select value={rule.operator} options={OPERATORS[rule.type]} style={{width: 150}}
                    onChange={operator => update({operator})}/>
            <div style={{flex: 1, minWidth: 200}}>{valueControl}</div>
            <Tooltip title="Remove rule">
                <Button type="text" icon={<CloseOutlined/>} onClick={() => dispatch(removeRule({list, key: rule.key!}))}/>
            </Tooltip>
        </Flex>
    );
}

function RuleCard(props: {
    list: RuleList,
    title: string,
    description: string,
    emptyText: string,
    addLabel: string,
    taxonomies: TaxonomyOption[],
    options: FilterOptions,
    extra?: ReactNode,
}) {
    const rules = useSelector((state: AutoPosterState) => state.filters[props.list]);
    const dispatch = useDispatch<AutoPosterDispatch>();
    const defaultField = props.taxonomies[0] ? `taxonomy:${props.taxonomies[0].value}` : 'author';

    return (
        <Card style={{marginBottom: 12}} styles={{body: {padding: 16}}}>
            <Flex justify="space-between" align="start" gap={12}>
                <Card.Meta title={props.title} description={props.description}/>
                {props.extra}
            </Flex>
            <Divider style={{margin: '12px 0'}}/>
            <Flex vertical gap={8}>
                {rules.length === 0 && <Typography.Text type="secondary">{props.emptyText}</Typography.Text>}
                {rules.map(rule => (
                    <RuleRow key={rule.key} rule={rule} list={props.list} taxonomies={props.taxonomies} options={props.options}/>
                ))}
                <div>
                    <Button size="small" icon={<PlusOutlined/>}
                            onClick={() => dispatch(addRule({list: props.list, rule: ruleForField(defaultField)}))}>
                        {props.addLabel}
                    </Button>
                </div>
            </Flex>
        </Card>
    );
}

function PreviewCard() {
    const {token} = theme.useToken();
    const filters = useSelector((state: AutoPosterState) => state.filters);
    const {data, loading, error, sendRequest} = useApi<{ filters: AutoPostFilters }, {
        /** Scheduled posts are tried first; published ones only when none of those match. */
        source: 'scheduled' | 'published',
        checked: number,
        matched: number,
        posts: ScheduledPostType[]
    }>();
    const [shownFor, setShownFor] = useState<AutoPostFilters | null>(null);
    // A result for older filters would be misleading.
    const stale = shownFor !== filters;

    const run = () => {
        setShownFor(filters);
        sendRequest('socialjet/autoposters/preview_filters', {filters});
    };

    return (
        <Card styles={{body: {padding: 16}}}>
            <Flex justify="space-between" align="start" gap={12}>
                <Card.Meta title="Test filters"
                           description="Check which of your scheduled posts these filters pick, or, if none match, which recent published posts they would have picked. Nothing is shared."/>
                <Button icon={<ExperimentOutlined/>} onClick={run} loading={loading}
                        disabled={filters.post_types.length === 0}>
                    Test
                </Button>
            </Flex>
            {(loading || (!stale && (data || error))) && <Divider style={{margin: '12px 0'}}/>}
            <Spin spinning={loading}>
                {!stale && error && <Alert type="error" showIcon message={error}/>}
                {!stale && data && !error && (
                    <Flex vertical gap={8}>
                        {data.source === 'scheduled' ? (
                            <Alert type="success" showIcon
                                   message={`${data.matched} of ${data.checked} scheduled posts match`}
                                   description="These will be shared when they get published."/>
                        ) : (
                            <Alert type={data.matched ? 'warning' : 'info'} showIcon
                                   message={`${data.matched} of the last ${data.checked} published posts match`}
                                   description={'Only an example: posts that are already published are not shared. '
                                       + 'The auto-poster shares posts published from now on, or unpublished and published again.'}/>
                        )}
                        {data.posts.map(p => (
                            <Flex key={p.id} align="center" gap={12} style={{
                                padding: '6px 10px',
                                background: token.colorBgContainer,
                                borderRadius: token.borderRadiusLG,
                                border: `1px solid ${token.colorBorderSecondary}`,
                            }}>
                                <PostThumb post={p} size={32}/>
                                <Flex vertical style={{minWidth: 0, flex: 1}}>
                                    <Typography.Link href={p.link} target="_blank" ellipsis>{p.title || '(no title)'}</Typography.Link>
                                    <Typography.Text type="secondary" style={{fontSize: 12}}>
                                        {[p.post_type, data.source === 'scheduled' ? `scheduled for ${p.date}` : p.date].filter(Boolean).join(' · ')}
                                    </Typography.Text>
                                </Flex>
                            </Flex>
                        ))}
                    </Flex>
                )}
            </Spin>
        </Card>
    );
}

const FiltersStep: FC = () => {
    const filters = useSelector((state: AutoPosterState) => state.filters);
    const dispatch = useDispatch<AutoPosterDispatch>();
    const {data: options, loading, error, sendRequest} = useApi<null, FilterOptions>();

    useEffect(() => {
        sendRequest('socialjet/autoposters/get_filter_options');
    }, [sendRequest]);

    /** Taxonomies of the selected post types, without duplicates. */
    const taxonomies = useMemo(() => {
        const found = new Map<string, TaxonomyOption>();
        options?.post_types
            .filter(pt => filters.post_types.includes(pt.value))
            .forEach(pt => pt.taxonomies.forEach(t => found.set(t.value, {value: t.value, label: t.label})));
        return [...found.values()];
    }, [options, filters.post_types]);

    if (!options) {
        return (
            <Flex justify="center" align="center" style={{height: '100%'}}>
                {loading || !error ? <Spin/> : <Empty description={error}/>}
            </Flex>
        );
    }

    return (
        <div style={{padding: 16}}>
            <Card style={{marginBottom: 12}} styles={{body: {padding: 16}}}>
                <Card.Meta title="Post types"
                           description="Only newly published posts of these types are checked. A post is checked again when it is unpublished and republished."/>
                <Divider style={{margin: '12px 0'}}/>
                <Select<string[]> mode="multiple" value={filters.post_types} style={{width: '100%'}}
                                  status={filters.post_types.length ? undefined : 'error'}
                                  placeholder="Select at least one post type"
                                  onChange={value => dispatch(setPostTypes(value))}
                                  options={options.post_types.map(pt => ({value: pt.value, label: pt.label}))}/>
            </Card>

            <RuleCard
                list="include"
                title="Share posts that match"
                description={filters.relation === 'and'
                    ? 'A post has to match every rule.'
                    : 'A post has to match at least one rule.'}
                emptyText="No rules: every new post of the selected types is shared."
                addLabel="Add rule"
                taxonomies={taxonomies}
                options={options}
                extra={
                    <Segmented<'and' | 'or'>
                        value={filters.relation}
                        onChange={value => dispatch(setRelation(value))}
                        options={[{value: 'and', label: 'Match all'}, {value: 'or', label: 'Match any'}]}
                    />
                }
            />

            <RuleCard
                list="exclude"
                title="Skip posts that match"
                description="A post matching any of these is never shared, even if it matches the rules above."
                emptyText="No exclusions."
                addLabel="Add exclusion"
                taxonomies={taxonomies}
                options={options}
            />

            <PreviewCard/>
        </div>
    );
};

export default FiltersStep;
