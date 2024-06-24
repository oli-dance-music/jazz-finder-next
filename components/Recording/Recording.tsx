import classes from './Recording.module.css';
import { type ReactNode } from 'react';
import type { Recording } from '@/types/media';
import RecordingArtist from './RecordingArtist';
import dynamic from 'next/dynamic';

const RecordingButtons = dynamic(() => import('./RecordingButtons'), {
	ssr: false,
});

/**
 * Renders a recording component with details such as title, artist, year, performers, record date, and a link to open on Archive.org.
 *
 * @param {Recording} recording - An object containing information about the recording, including artist, title, performers, year, record date, URL, and raw data.
 * @return {JSX.Element} A React component representing the recording.
 */
export default async function Recording(recording: Recording) {
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

	const response = await fetch(apiUrl!, {
		next: {
			revalidate: 10,
		},
	});
	const mp3Data = (await response.json()) as {
		files: { format: string; name: string }[];
	};

	const mp3File = mp3Data.files.find(
		({ format }: { format: string }) => format === 'VBR MP3'
	);
	const mp3Url = mp3File ? mp3Path + '/' + mp3File.name : null;

	/* TODO this is not always getting all performers, because not all of them are 
	mapped properly.maybe use the raw data and map them manually? for now deactivated */
	const performersMapped = Object.keys(performers).map((name) => {
		const upperCaseName = name.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
			letter.toUpperCase()
		);
		const instruments = performers[name];

		return (
			<RecordingArtist
				key={`${upperCaseName}${title}${artist}`}
				className={classes.artistLink}
				artist={upperCaseName}
				instruments={instruments}
			/>
		);
	});

	return (
		<div className={classes.recording}>
			<h3>
				{/* <Link href={`/recordings/${recording.IDX}`}> */}
				{title} - {artist} ({year}){/* </Link> */}
				<small>
					<RecordingButtons recording={recording} mp3Url={mp3Url!} />
				</small>
			</h3>
			<dl className={classes.recordingDetails}>
				<dt>Performers</dt>
				<dd>
					{performersRaw as ReactNode}
					<br />
					{performersMapped ?? performersMapped}
				</dd>
				<dt>Record Date</dt>
				<dd>
					{dateRaw} (Label: {record})
				</dd>
			</dl>
			<p>
				<a href={url} target="_blank" rel="noreferrer">
					Open on Archive.org
				</a>
			</p>
			<hr />
		</div>
	);
}
