'use client';
import { MediaContext, useMediaReducer } from '@/lib/reducer/media';
import { SearchContext, useSearchReducer } from '@/lib/reducer/search';
import Header from './Header'; /*, { HeaderContext, useHeaderTitle } */
import MediaPlayer from './MediaPlayer/MediaPlayer';
import SearchPage from './SearchPage/SearchPage';
//import Grid from './primitives/Grid/Grid';

export default function JazzFinder() {
	const [media, mediaDispatch] = useMediaReducer();
	const [search, searchDispatch] = useSearchReducer();
	/* const [title, useTitle] = useHeaderTitle(); */

	return (
		<MediaContext.Provider value={[media, mediaDispatch]}>
			<SearchContext.Provider value={[search, searchDispatch]}>
				{/* <h2 style={{ textAlign: 'center' }}>Player</h2>
				<MediaPlayer /> */}
				<h2 style={{ textAlign: 'center' }}>Search</h2>
				<SearchPage />
				<div
					style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 'bold' }}
				>
					&copy; {new Date().getFullYear()} Oliver Fuhrmann
				</div>
			</SearchContext.Provider>
		</MediaContext.Provider>
	);
}
