import { useState } from 'react';
import { useSearchContext, useSearchHook } from '@/lib/reducer/search';
import Loader from '../primitives/Loader/Loader';
import Pagination from '../Pagination/Pagination';
import Recording from '../Recording/Recording';
import List from '../primitives/List/List';
import SearchForm from '../SearchForm/SearchForm';

import classes from './SearchPage.module.css';
import type { Recording as RecordingType } from '@/types/media';

export default function SearchPage() {
	//we init the searchReducer and spread the search object into variables
	const [search] = useSearchContext()!;
	const { pageSize } = search;

	//we use a state that mirrors the response object from the API
	const [
		{ results: searchResults, total_results: totalResults },
		setSearchResults,
	] = useState({ results: [], total_results: 0 });

	//state of the site loading
	const [loading, setLoading] = useState(false);

	//this implements an effect that updates search result when a search parameter changes
	useSearchHook({ search, setSearchResults, setLoading });

	return (
		<div className={classes.searchPage}>
			<SearchForm />
			{loading ? (
				<Loader />
			) : (
				<>
					{searchResults.length ? (
						<>
							<Pagination totalResults={totalResults} pageSize={pageSize} />
							<List>
								{searchResults.map((item: RecordingType) => (
									<Recording
										key={item.IDX}
										id={item.IDX}
										url={item.URL}
										rawData={item}
										{...item}
									/>
								))}
							</List>
						</>
					) : (
						<div
							style={{
								textAlign: 'center',
								fontSize: '2rem',
								fontWeight: 'bold',
							}}
						>
							No Results found, please check your search
						</div>
					)}
				</>
			)}
		</div>
	);
}
