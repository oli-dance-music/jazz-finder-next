//import SearchForm from '@/components/SearchForm/SearchForm';
import Pagination from '@/components/Pagination/Pagination';
import Recording from '@/components/Recording/Recording';
import SearchForm from '@/components/SearchForm/SearchForm';
import type { Recording as RecordingType } from '@/types/media';
import type { SearchResponse } from '@/types/search';

export default async function FinderPage({
	searchParams,
}: {
	searchParams?: {
		searchTerm?: string;
		yearStart?: string;
		yearEnd?: string;
		currentPage?: string;
	};
}) {
	const LOCAL_API_BASE = process.env.LOCAL_API_BASE;

	const pageSize = 10;

	const params = {
		searchTerm: searchParams?.searchTerm || '',
		yearStart: searchParams?.yearStart || '',
		yearEnd: searchParams?.yearEnd || '',
		pageSize: pageSize.toString(),
		currentPage: searchParams?.currentPage || '1',
	};

	const apiUrl =
		`${LOCAL_API_BASE}/api/recordings?` + new URLSearchParams(params);

	const response = await fetch(apiUrl, {
		next: {
			revalidate: 10,
		},
	});
	const data = (await response.json()) as SearchResponse;
	const records = data.results as RecordingType[];

	return (
		<div>
			<h1>Jazz Finder</h1>
			<SearchForm />
			<Pagination
				totalResults={data.total_results}
				pageSize={pageSize}
				currentPage={data.current_page}
			/>
			{records &&
				records.map((record) => <Recording key={record.IDX} {...record} />)}
			<Pagination
				totalResults={data.total_results}
				pageSize={pageSize}
				currentPage={data.current_page}
			/>
		</div>
	);
}
