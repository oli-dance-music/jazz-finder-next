import { useMediaContext } from '@/lib/reducer/media';
import List from '../primitives/List/List';
import RecordingTeaser from '../Recording/RecordingTeaser';
import { Suspense, useEffect } from 'react';
import Card from '../primitives/Card/Card';
import useConfirm from '@/hooks/useConfirm';
import type { Recording as RecordingType } from '@/types/media';
import RecordingButtons from '../Recording/RecordingButtons';

export default function MediaPlayerPlaylist() {
	const [{ playing, playlist }, mediaDispatch] = useMediaContext()!;

	/* const [title, setTitle] = useHeaderContext(); */

	useLocalStorage(playlist);

	const confirmEmptyPlaylist = useConfirm(
		'Are you sure you want to empty the playlist?',
		() => {
			mediaDispatch({
				action: 'emptyPlaylist',
			});
		}
	);
	const handleMediaPlayer = (action: string) => {
		//if there is no playlist, we dont need to do anything
		if (!playlist.length) return;

		switch (action) {
			case 'startPlaylist':
				if (playlist.length && playlist[0].src) {
					mediaDispatch({
						action: 'play',
						payload: playlist[0],
					});
				}
				break;
			case 'next':
				mediaDispatch({
					action: 'play',
					payload: playlist[playing! < playlist.length - 1 ? playing! + 1 : 0],
				});
				break;
			case 'previous':
				mediaDispatch({
					action: 'play',
					payload: playlist[playing! > 0 ? playing! - 1 : playlist.length - 1],
				});
				break;
			case 'emptyPlaylist':
				confirmEmptyPlaylist();
				break;
		}
	};
	return (
		<Card>
			<Card.Header>
				<Card.Toggle disabled={playlist.length === 0}>
					Show Playlist ({playlist.length} songs)
				</Card.Toggle>
				<button
					onClick={() => handleMediaPlayer('startPlaylist')}
					disabled={playlist.length === 0}
				>
					Start Playlist
				</button>
				<button
					onClick={() => handleMediaPlayer('emptyPlaylist')}
					disabled={playlist.length === 0}
				>
					Empty Playlist
				</button>
			</Card.Header>
			<Card.Body>
				<ul>
					{playlist.map((item) => (
						<li key={item.IDX}>
							<button
								disabled={
									(playing !== null && playlist[playing].IDX === item.IDX) ||
									item.src === null
										? true
										: false
								}
								onClick={() =>
									mediaDispatch({
										action: 'play',
										payload: { ...item, src: item.src },
									})
								}
							>
								Play
							</button>
							<button
								onClick={() =>
									mediaDispatch({
										action: 'removeFromPlaylist',
										payload: { ...item, src: item.src },
									})
								}
							>
								Remove
							</button>
							{item.Artist} - {item.Title}
						</li>
					))}
				</ul>
			</Card.Body>
		</Card>
	);
}
function useLocalStorage(playlist: RecordingType[]) {
	useEffect(() => {
		localStorage.setItem('playlist', JSON.stringify(playlist));
	}, [playlist]);
}
