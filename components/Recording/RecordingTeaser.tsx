'use client';
import classes from './Recording.module.css';
import Toggle from '../primitives/Toggle/Toggle';
import axios from 'redaxios';
import { type Dispatch, type ReactNode, type SetStateAction } from 'react';
import Card from '../primitives/Card/Card';
import type { Recording } from '@/types/media';
import RecordingArtist from './RecordingArtist';
import dynamic from 'next/dynamic';

const RecordingButtons = dynamic(() => import('./RecordingButtons'), {
	ssr: false,
});

/**
 * Renders a teaser component for a recording.
 *
 * @param {Recording} recording - An object containing information about the recording, including artist, title, performers, year, record date, URL, and raw data.
 * @return {JSX.Element} A React component representing the recording teaser.
 */
export default function RecordingTeaser(recording: Recording) {
	const {
		Artist: artist,
		Title: title,
		PEOPLE: performers,
		Year: year,
		//Month: month,
		//Day: day,
		Record: record,
		URL: url,
		SRC,
		rawData,
	} = recording;

	const { Date: dateRaw, Performers: performersRaw } = SRC;

	const apiUrl = url?.replace('details', 'metadata');
	const mp3Path = url?.replace('details', 'download');

	/* const response = await fetch(apiUrl!, {
		next: {
			revalidate: 10,
		},
	});
	const mp3Data = (await response.json()) as {
		files: { format: string; name: string }[];
	}; */

	/* const mp3File = mp3Data.files.find(
		({ format }: { format: string }) => format === 'VBR MP3'
	);
	const mp3Url = mp3File ? mp3Path + '/' + mp3File.name : null; */

	return (
		<div className={classes.recording}>
			{/* <RecordingButtons recording={recording} mp3Url={mp3Url!} /> */}
			<h3>
				{title} - {artist} ({year})
			</h3>
		</div>
	);
}
