import { NextRequest, NextResponse } from 'next/server';

import allRecordings from '@/lib/data.json';
import type { Recording } from '@/types/media';

type Props = {
	params: {
		IDX: string;
	};
};

/**
 * GET function for retrieving a specific recording by IDX.
 * 	https://nextjs.org/docs/app/api-reference/functions/next-request
 *	https://nextjs.org/docs/app/api-reference/functions/next-response
 *
 * @param {NextRequest} request - The incoming request object.
 * @param {Props} props - The props object containing the IDX parameter.
 * @returns {NextResponse} The response object containing the recording data.
 */
export function GET(request: NextRequest, { params: { IDX } }: Props) {
	console.log('idx', IDX);

	const recording = getRecording(IDX);

	if (recording === null) {
		return NextResponse.json({ error: 'Recording not found' }, { status: 404 });
	}
	return NextResponse.json(recording);
}

/**
 * Retrieves a recording based on the provided IDX.
 *
 * @param {string} IDX - The unique identifier of the recording to retrieve.
 * @return {Recording | null} The matching recording if found, otherwise null.
 */
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
