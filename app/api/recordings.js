//import allRecordings from './data.json' assert { type: 'json' };
import fs from 'fs';
import path from 'path';
import process from 'process';

export default function handler(request, response) {
	const filePath = path.join(process.cwd(), 'api/data.json');
	const allRecordings = JSON.parse(fs.readFileSync(filePath));

	const {
		searchTerm = '',
		yearStart = '',
		yearEnd = '',
		currentPage = 1,
		pageSize = 20,
	} = request.query;

	// Array mit Einträgen bzw. leerer Array, falls searchTerm leer ist
	const filteredRecordings = getRecordings(searchTerm, yearStart, yearEnd);

	return response.json(
		buildResponse(
			filteredRecordings,
			currentPage,
			parseInt(pageSize),
			request.query
		)
	);

	function getRecordings(searchTermRaw = '', yearStart = '', yearEnd = '') {
		//replace , with | for regex to find any term
		const searchTerms = decodeURIComponent(searchTermRaw)
			.split(',')
			.map((term) => term.trim())
			.join('|')
			.split('+')
			.map((term) => term.trim());

		//find recordings for each term
		const arrayOfArrays = searchTerms.map((term) => {
			const regExp = new RegExp(term, 'i');
			return allRecordings.filter(
				({ Title, Artist, SRC }) =>
					regExp.test(Title) ||
					regExp.test(Artist) ||
					regExp.test(SRC.Performers)
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
		recordings,
		currentPage = 1,
		pageSize = 10,
		query = ''
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
			query,
		};
	}
}
