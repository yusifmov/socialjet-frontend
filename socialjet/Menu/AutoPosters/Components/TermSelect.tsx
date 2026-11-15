import {useEffect, useMemo, useRef, useState} from "react";
import {Flex, Select, Spin, Typography} from "antd";
import {apiFetch} from "@socialjet/sdk";
import {TermOption} from "../Types/AutoPostFilters.ts";

type TermsResponse = { terms: TermOption[] };

/**
 * Multi-select of a taxonomy's terms, searched on the server (sites can have
 * thousands of tags). Labels of selected terms are resolved on mount and kept
 * while the search results change.
 */
function TermSelect(props: {
    taxonomy: string,
    value: number[],
    onChange: (value: number[]) => void,
    status?: 'warning',
}) {
    const [options, setOptions] = useState<TermOption[]>([]);
    const [known, setKnown] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(false);
    const debounce = useRef<number | undefined>(undefined);
    const latest = useRef(0);

    const remember = (terms: TermOption[]) =>
        setKnown(current => ({...current, ...Object.fromEntries(terms.map(t => [t.value, t.label]))}));

    const load = async (search: string) => {
        const call = ++latest.current;
        setLoading(true);
        try {
            const res = await apiFetch<object, TermsResponse>('socialjet/autoposters/get_terms', {taxonomy: props.taxonomy, search});
            if (call !== latest.current) return;
            setOptions(res?.terms ?? []);
            remember(res?.terms ?? []);
        } catch {
            if (call === latest.current) setOptions([]);
        } finally {
            if (call === latest.current) setLoading(false);
        }
    };

    useEffect(() => {
        setOptions([]);
        load('');

        if (props.value.length) {
            apiFetch<object, TermsResponse>('socialjet/autoposters/get_terms', {taxonomy: props.taxonomy, include: props.value})
                .then(res => remember(res?.terms ?? []))
                .catch(() => undefined);
        }

        return () => window.clearTimeout(debounce.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.taxonomy]);

    const onSearch = (search: string) => {
        window.clearTimeout(debounce.current);
        debounce.current = window.setTimeout(() => load(search), 300);
    };

    const selectOptions = useMemo(() => {
        const shown = options.map(t => ({value: t.value, label: t.label, count: t.count}));
        // Selected terms missing from the current results still need their label.
        const missing = props.value
            .filter(id => !options.some(t => t.value === id))
            .map(id => ({value: id, label: known[id] ?? '…'}));
        return [...missing, ...shown];
    }, [options, known, props.value]);

    return (
        <Select<number[]>
            mode="multiple"
            showSearch
            filterOption={false}
            onSearch={onSearch}
            value={props.value}
            onChange={props.onChange}
            options={selectOptions}
            notFoundContent={loading ? <Spin size="small"/> : 'No terms found'}
            placeholder="Search terms…"
            status={props.status}
            style={{width: '100%'}}
            maxTagCount="responsive"
            // Term names aren't unique (e.g. several "Uncategorized"), so show the post count and id too.
            optionRender={option => (
                <Flex justify="space-between" gap={8}>
                    <span>{option.label}</span>
                    {'count' in option.data && (
                        <Typography.Text type="secondary" style={{fontSize: 12}}>
                            {option.data.count} posts · #{option.value}
                        </Typography.Text>
                    )}
                </Flex>
            )}
        />
    );
}

export default TermSelect;
