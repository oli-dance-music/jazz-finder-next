import { NextRequest, NextResponse } from 'next/server';

import allRecordings from '@/lib/data.json';
import type { Recording } from '@/types/media';

/*
https://nextjs.org/docs/app/api-reference/functions/next-request
https://nextjs.org/docs/app/api-reference/functions/next-response
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

	// Array mit Einträgen bzw. leerer Array, falls searchTerm leer ist
	const filteredRecordings = getRecordings(searchTerm, yearStart, yearEnd);

	// Kurze Variante, fügt automatisch Statuscode 200 und Conten-Type JSON hinzu.
	return NextResponse.json(
		buildResponse(filteredRecordings, currentPage, pageSize)
	);

	// Ausführliche Variante, wenn man z.B. CORS-Header setzen möchte:
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

function buildResponse(
	recordings: Recording[],
	currentPage = 1,
	pageSize = 10
) {
	const lastPage = Math.ceil(recordings.length / pageSize);
	//if the current page is too high, set it to the last existing page, if it is too low set it to 1
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
