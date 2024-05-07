import { NextRequest, NextResponse } from 'next/server';

import allRecordings from '@/lib/data.json';
import type { Recording } from '@/types/media';

type Props = {
	params: {
		IDX: string;
	};
};

/*
https://nextjs.org/docs/app/api-reference/functions/next-request
https://nextjs.org/docs/app/api-reference/functions/next-response
*/
export function GET(request: NextRequest, { params: { IDX } }: Props) {
	console.log('idx', IDX);

	const recording = getRecording(IDX);

	if (recording === null) {
		return NextResponse.json({ error: 'Recording not found' }, { status: 404 });
	}
	return NextResponse.json(recording);
}

function getRecording(IDX: string) {
	//replace , with | for regex to find any term

	const allRecordingsArray = allRecordings as Recording[];

	const filteredRecordings = allRecordingsArray.filter(
		(recording) => recording.IDX === Number(IDX)
	);

	if (filteredRecordings.length === 0) {
		return null;
	}
	return filteredRecordings[0];
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
