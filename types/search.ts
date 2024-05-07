import { type Dispatch, type SetStateAction } from 'react';
import type { Recording } from './media';

export type SearchReducer = {
	searchTerm: string;
	yearStart: string;
	yearEnd: string;
	currentPage: number;
	pageSize: number;
	[key: string]: any;
};
export type SearchResponse = {
	results: Recording[];
	current_page: number;
	total_results: number;
	total_pages: number;
};

export type SearchReducerMessage =
	| {
			action: 'set';
			parameter: string;
			payload: string;
	  }
	| { action: 'reset' };

export type SearchHook = {
	search: SearchReducer;
	setSearchResults: Dispatch<
		SetStateAction<{
			results: never[];
			total_results: number;
		}>
	>;
	setLoading: Dispatch<SetStateAction<boolean>>;
};

export type SearchReducerContext =
	| [SearchReducer, Dispatch<SearchReducerMessage>]
	| null;
