/**
 * Mirrors the backend's PostFilterMatcher. `key` only exists client-side, for React lists.
 */
export type FilterRuleType = 'taxonomy' | 'author' | 'featured_image' | 'title' | 'password_protected';

export interface FilterRule {
    key?: string;
    type: FilterRuleType;
    operator: string;
    taxonomy?: string;
    values?: (number | string)[];
}

export interface AutoPostFilters {
    post_types: string[];
    /** How include rules combine. Exclude rules always skip the post when any of them matches. */
    relation: 'and' | 'or';
    include: FilterRule[];
    exclude: FilterRule[];
}

export interface FilterOption<V = string> {
    value: V;
    label: string;
}

export interface FilterOptions {
    post_types: (FilterOption & { taxonomies: (FilterOption & { hierarchical: boolean })[] })[];
    authors: FilterOption<number>[];
    rule_types: string[];
}

export interface TermOption extends FilterOption<number> {
    count: number;
    parent: number;
}

export function emptyFilters(): AutoPostFilters {
    return {post_types: ['post'], relation: 'and', include: [], exclude: []};
}

let lastKey = 0;
export const ruleKey = () => `rule-${++lastKey}`;

/** Operators per rule type, worded to read after the field name ("Category is any of …"). */
export const OPERATORS: Record<FilterRuleType, FilterOption[]> = {
    taxonomy: [
        {value: 'any', label: 'is any of'},
        {value: 'all', label: 'has all of'},
        {value: 'none', label: 'is none of'},
    ],
    author: [
        {value: 'any', label: 'is any of'},
        {value: 'none', label: 'is none of'},
    ],
    featured_image: [
        {value: 'has', label: 'is set'},
        {value: 'has_not', label: 'is not set'},
    ],
    title: [
        {value: 'contains', label: 'contains any of'},
        {value: 'not_contains', label: 'contains none of'},
    ],
    password_protected: [
        {value: 'is', label: 'is on'},
        {value: 'is_not', label: 'is off'},
    ],
};
