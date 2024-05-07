'use client';
import { useMediaContext } from '@/lib/reducer/media';
import type { Recording } from '@/types/media';

type Props = {
	recording: Recording;
	mp3Url: string;
};
export default function RecordingButtons({ recording, mp3Url }: Props) {
	const [{ playing, playlist }, mediaDispatch] = useMediaContext()!;

	const isInPlaylist = playlist.some(({ IDX }) => IDX === recording.IDX);
	const isPlaying = playing !== null && playlist[playing].IDX === recording.IDX;

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
