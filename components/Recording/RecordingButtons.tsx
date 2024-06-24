'use client';
import { useMediaContext } from '@/lib/reducer/media';
import type { Recording } from '@/types/media';

type Props = {
	recording: Recording;
	mp3Url: string;
};
/**
 * Function component for rendering recording buttons based on the provided recording and mp3Url.
 *
 * @param {Props} recording - The recording object to display buttons for.
 * @param {string} mp3Url - The URL of the mp3 file associated with the recording.
 * @return {JSX.Element} The JSX element representing the recording buttons.
 */
export default function RecordingButtons({ recording, mp3Url }: Props) {
	const [{ playing, playlist }, mediaDispatch] = useMediaContext()!;

	let recordings = playlist.recordings;
	if (recordings === undefined) recordings = [];

	const isInPlaylist = recordings.some(({ IDX }) => IDX === recording.IDX);
	const isPlaying =
		playing !== null && recordings[playing].IDX === recording.IDX;

	return (
		<>
			<button
				disabled={isPlaying || mp3Url === null ? true : false}
				onClick={() =>
					mediaDispatch({
						action: 'play',
						payload: { ...recording, src: mp3Url },
					})
				}
			>
				Play
			</button>
			{!isInPlaylist ? (
				<button
					onClick={() =>
						mediaDispatch({
							action: 'addToPlaylist',
							payload: { ...recording, src: mp3Url },
						})
					}
				>
					Add
				</button>
			) : (
				<button
					onClick={() =>
						mediaDispatch({
							action: 'removeFromPlaylist',
							payload: { ...recording, src: mp3Url },
						})
					}
				>
					Remove
				</button>
			)}
		</>
	);
}
