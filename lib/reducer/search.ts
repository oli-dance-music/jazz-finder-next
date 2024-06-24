import type {
	SearchHook,
	SearchReducer,
	SearchReducerContext,
	SearchReducerMessage,
} from '@/types/search';
import { createContext, useContext, useEffect, useReducer } from 'react';
import axios from 'redaxios';

export const SearchContext = createContext<SearchReducerContext>(null);

/**
 * Returns the search context from the useContext hook.
 *
 * @return {SearchReducerContext} The search context from the useContext hook.
 */
export function useSearchContext() {
	return useContext(SearchContext);
}

/**
 * A function that handles all the search form changes.
 *
 * @param {SearchReducer} search - The current search state.
 * @param {SearchReducerMessage} message - The message triggering the action.
 * @return {SearchReducer} The updated search state based on the message action.
 */
function searchReducer(search: SearchReducer, message: SearchReducerMessage) {
	switch (message.action) {
		case 'set':
			return { ...search, [message.parameter]: message.payload };
		case 'reset':
			return { ...getSearchDefaults() };
	}
}

/**
 * Returns the search state and dispatch function using the `useReducer` hook with the `searchReducer` and `getInitialSearch` functions.
 *
 * @return {[SearchReducer, (message: SearchReducerMessage) => void]} The search state and dispatch function.
 */
export function useSearchReducer() {
	return useReducer(searchReducer, null, getInitialSearch);
}

/**
 * Returns an object with default values for the search reducer.
 *
 * @return {SearchReducer} An object with default values for the search reducer.
 */
function getSearchDefaults() {
	return {
		searchTerm: '',
		yearStart: '',
		yearEnd: '',
		currentPage: 1,
		pageSize: 10,
	} as SearchReducer;
}

/**
 * Returns the initial search values based on either the default values or the URL parameters.
 *
 * @return {SearchReducer} The initial search values.
 */
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

/**
 * Perform a search operation and handle loading state based on search parameters.
 *
 * @param {SearchHook} search - The search parameters including searchTerm, yearStart, yearEnd, currentPage, and pageSize.
 * @param {Function} setSearchResults - Function to set the search results data.
 * @param {Function} setLoading - Function to set the loading state.
 * @return {void} No explicit return value.
 */
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

		/**
		 * Fetches data from the API and updates the search results and loading state.
		 *
		 * @return {Promise<void>} - A promise that resolves when the data is fetched and the search results and loading state are updated.
		 */
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
