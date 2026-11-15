import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AutoPostFilters, emptyFilters, FilterRule, ruleKey} from "../Types/AutoPostFilters.ts";

type RuleList = 'include' | 'exclude';

const filtersSlice = createSlice({
    name: 'autoposter_filters',
    initialState: emptyFilters(),
    reducers: {
        /** Replaces all filters; rules coming from the server get client-side keys. */
        setFilters: (_state, action: PayloadAction<AutoPostFilters | null | undefined>) => {
            const filters = action.payload ?? emptyFilters();
            return {
                ...filters,
                include: filters.include.map(r => ({...r, key: r.key ?? ruleKey()})),
                exclude: filters.exclude.map(r => ({...r, key: r.key ?? ruleKey()})),
            };
        },
        setPostTypes: (state, action: PayloadAction<string[]>) => {
            state.post_types = action.payload;
        },
        setRelation: (state, action: PayloadAction<'and' | 'or'>) => {
            state.relation = action.payload;
        },
        addRule: (state, action: PayloadAction<{ list: RuleList, rule: FilterRule }>) => {
            state[action.payload.list].push({...action.payload.rule, key: ruleKey()});
        },
        updateRule: (state, action: PayloadAction<{ list: RuleList, key: string, rule: FilterRule }>) => {
            const i = state[action.payload.list].findIndex(r => r.key === action.payload.key);
            if (i > -1) state[action.payload.list][i] = {...action.payload.rule, key: action.payload.key};
        },
        removeRule: (state, action: PayloadAction<{ list: RuleList, key: string }>) => {
            state[action.payload.list] = state[action.payload.list].filter(r => r.key !== action.payload.key);
        },
    },
});

export const {setFilters, setPostTypes, setRelation, addRule, updateRule, removeRule} = filtersSlice.actions;
export default filtersSlice.reducer;
