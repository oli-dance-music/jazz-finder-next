import { NextRequest, NextResponse } from 'next/server';

import allRecordings from '@/lib/data.json';
import type { Recording } from '@/types/media';

/**
 * Retrieves recordings based on the provided search parameters and returns a JSON response.
 *
 * @param {NextRequest} request - The Next.js request object containing the search parameters.
 * @return {NextResponse} A JSON response containing the filtered recordings.
 */
export function GET(request: NextRequest) {
	const searchTerm = request.nextUrl.searchParams.get('searchTerm') ?? '';
	const yearStart = request.nextUrl.searchParams.get('yearStart') ?? '';
	const yearEnd = request.nextUrl.searchParams.get('yearEnd') ?? '';
	const currentPageRaw = Number(
		request.nextUrl.searchParams.get('currentPage')
	);
	const currentPage = currentPageRaw > 1 ? currentPageRaw : 1;
	const pageSizeRaw = Number(request.nextUrl.searchParams.get('pageSize'));
	const pageSize = pageSizeRaw >= 1 ? pageSizeRaw : 10;

	// Empty array if searchTerm is empty, otherwise array with matching entries
	const filteredRecordings = getRecordings(searchTerm, yearStart, yearEnd);

	// Short version, automatically adds status code 200 and Content-Type JSON.
	return NextResponse.json(
		buildResponse(filteredRecordings, currentPage, pageSize)
	);

	// Verbose version, which can be used if you want to set CORS headers, for example:
	return new NextResponse(
		JSON.stringify(buildResponse(filteredRecordings, currentPage, pageSize)),
		{
			status: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type, Authorization',
				'Content-Type': 'application/json',
			},
		}
	);
}

/**
 * Retrieves recordings that match the given search terms and year range.
 *
 * @param {string} searchTermRaw - A comma-separated string of search terms. Defaults to an empty string.
 * @param {string} yearStart - The starting year for the search. Defaults to an empty string.
 * @param {string} yearEnd - The ending year for the search. Defaults to an empty string.
 * @return {Array} An array of recordings that match the search criteria.
 */
function getRecordings(searchTermRaw = '', yearStart = '', yearEnd = '') {
	//replace , with | for regex to find any term

	const allRecordingsArray = allRecordings as Recording[];

	const searchTerms = decodeURIComponent(searchTermRaw)
		.split(',')
		.map((term) => term.trim())
		.join('|')
		.split('+')
		.map((term) => term.trim());

	//find recordings for each term
	const arrayOfArrays = searchTerms.map((term) => {
		const regExp = new RegExp(term, 'i');
		return allRecordingsArray.filter(
			({ Title, Artist, SRC }) =>
				regExp.test(Title) || regExp.test(Artist) || regExp.test(SRC.Performers)
		);
	});

	//intersection of the different findings
	let filteredRecordings = arrayOfArrays.reduce((a, b) =>
		a.filter((c) => b.includes(c))
	);

	if (yearStart.length || yearEnd.length) {
		filteredRecordings = filteredRecordings.filter(({ Year }) => {
			if (yearStart.length && yearEnd.length) {
				return Year >= yearStart && Year <= yearEnd;
			} else if (yearStart.length) {
				return Year >= yearStart;
			} else if (yearEnd.length) {
				return Year <= yearEnd;
			}
		});
	}
	return filteredRecordings;
}

/**
 * Builds a response object containing a subset of recordings, along with pagination and query information.
 *
 * @param {Recording[]} recordings - The array of recordings to be paginated.
 * @param {number} [currentPage=1] - The current page number. Defaults to 1.
 * @param {number} [pageSize=10] - The number of recordings per page. Defaults to 10.
 * @return {Object} An object containing the following properties:
 *   - results: An array of recordings for the current page.
 *   - current_page: The current page number.
 *   - page_size: The number of recordings per page.
 *   - total_results: The total number of recordings.
 *   - total_pages: The total number of pages.
 */
function buildResponse(
	recordings: Recording[],
	currentPage = 1,
	pageSize = 10
) {
	const lastPage = Math.ceil(recordings.length / pageSize);
	//if the current page is not existing, set it to the last existing page, if it is too low set it to 1
	currentPage = Math.max(1, Math.min(currentPage, lastPage));

	const start = (currentPage - 1) * pageSize;
	const end = start + pageSize;
	return {
		results: recordings.slice(start, end),
		current_page: currentPage,
		page_size: pageSize,
		total_results: recordings.length,
		total_pages: lastPage,
	};
}
