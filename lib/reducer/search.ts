import type {
	SearchHook,
	SearchReducer,
	SearchReducerContext,
	SearchReducerMessage,
} from '@/types/search';
import { createContext, useContext, useEffect, useReducer } from 'react';
import axios from 'redaxios';

export const SearchContext = createContext<SearchReducerContext>(null);

export function useSearchContext() {
	return useContext(SearchContext);
}

//this handles all the search form changes
function searchReducer(search: SearchReducer, message: SearchReducerMessage) {
	switch (message.action) {
		case 'set':
			return { ...search, [message.parameter]: message.payload };
		case 'reset':
			return { ...getSearchDefaults() };
	}
}

export function useSearchReducer() {
	return useReducer(searchReducer, null, getInitialSearch);
}

//this returns the default values for the search
function getSearchDefaults() {
	return {
		searchTerm: '',
		yearStart: '',
		yearEnd: '',
		currentPage: 1,
		pageSize: 10,
	} as SearchReducer;
}

//this returns the initial search values based on either the url parameters or the default values
export function getInitialSearch() {
	const defaultValues = getSearchDefaults();

	/* const url = new URL(window.location.href);

	//get url param values, but check if the parameters exist in defaults object
	const searchValues = Object.fromEntries(
		Array.from(url.searchParams.entries())
			.filter(([key]) => key in defaultValues)
			.map(([key, value]) => [key, decodeURIComponent(value)])
	);

	//we assign the search values to the default values object
	Object.assign(defaultValues, searchValues);
 */
	return defaultValues;
}

export function useSearchHook({
	search,
	setSearchResults,
	setLoading,
}: SearchHook) {
	const { searchTerm, yearStart, yearEnd, currentPage, pageSize } = search;

	//do search once in the beginning without parameters to load all recordings (paginated)
	useEffect((): (() => void) | void => {
		console.log(search);
		setLoading(true);
		let ignore = false; // setup variable to ignore api calls if there is a newer search request

		//saving url in parameters
		/* const url = new URL(window.location.href);

		//go through all params and if they are not the default value, set them
		Object.entries(search).forEach(([param, value]) => {
			url.searchParams.delete(param);
			if (value !== getSearchDefaults()[param]) {
				url.searchParams.set(param, encodeURIComponent(value));
			}
		});

		window.history.replaceState({}, '', url.href); */

		const fetchData = async () => {
			try {
				//accessing mock api that is hosted serverless on the same url
				const apiUrl = `${new URL(window.location.href).origin}/api/recordings`;

				const params = {
					searchTerm: encodeURIComponent(searchTerm),
					yearStart,
					yearEnd,
					pageSize,
					currentPage,
				};
				const { data } = await axios.get(apiUrl, {
					params,
				});

				//if ignore is set, we ignore the data, because a newer request is in progress
				if (ignore) {
					return;
				}
				console.log(data);
				setSearchResults(data);

				setLoading(false);
			} catch (error) {
				console.log(`Error: ${error}`);
				setLoading(false);
			}
		};
		fetchData(); //doSearch(search, searchDispatch);

		//set a return function that sets ignore true
		return () => (ignore = true);
	}, [searchTerm, yearStart, yearEnd, currentPage, pageSize]); // eslint-disable-line
}
