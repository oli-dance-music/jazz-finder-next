import { useMediaContext } from '@/lib/reducer/media';
import { useEffect } from 'react';
import Card from '../primitives/Card/Card';
import useConfirm from '@/hooks/useConfirm';
import type { PlaylistType, Recording as RecordingType } from '@/types/media';
import SavePlaylistDialog from './SavePlaylistDialog';
import LoadPlaylistDialog from './LoadPlaylistDialog';
import DeletePlaylistDialog from './DeletePlaylistDialog';

export default function MediaPlayerPlaylist() {
	const [{ playing, playlist }, mediaDispatch] = useMediaContext()!;

	let recordings = playlist.recordings;
	if (recordings === undefined) recordings = [];
	useLocalStorage(playlist);

	const confirmEmptyPlaylist = useConfirm(
		'Are you sure you want to empty the playlist (unsaved changes will be discarded)?',
		() => {
			mediaDispatch({
				action: 'emptyPlaylist',
			});
		}
	);
	const handleMediaPlayer = (action: string) => {
		//if there is no playlist, we dont need to do anything
		if (!recordings) return;

		switch (action) {
			case 'startPlaylist':
				if (recordings.length && recordings[0].src) {
					mediaDispatch({
						action: 'play',
						payload: recordings[0],
					});
				}
				break;
			case 'next':
				mediaDispatch({
					action: 'play',
					payload:
						recordings[playing! < recordings.length - 1 ? playing! + 1 : 0],
				});
				break;
			case 'previous':
				mediaDispatch({
					action: 'play',
					payload:
						recordings[playing! > 0 ? playing! - 1 : recordings.length - 1],
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
				<Card.Toggle disabled={recordings.length === 0}>
					Show Playlist {playlist.name ?? '(unsaved)'} ({recordings.length}{' '}
					songs)
				</Card.Toggle>
				<button
					onClick={() => handleMediaPlayer('startPlaylist')}
					disabled={recordings.length === 0}
				>
					Start
				</button>
				<SavePlaylistDialog disabled={recordings.length === 0} />
				<LoadPlaylistDialog />
				<DeletePlaylistDialog disabled={playlist.id === undefined} />
				<button
					onClick={() => handleMediaPlayer('emptyPlaylist')}
					disabled={recordings.length === 0}
				>
					New Playlist
				</button>
			</Card.Header>
			<Card.Body>
				<ul>
					{recordings.map((item) => (
						<li key={item.IDX}>
							<button
								disabled={
									(playing !== null && recordings[playing].IDX === item.IDX) ||
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
function useLocalStorage(playlist: PlaylistType) {
	useEffect(() => {
		localStorage.setItem('playlist', JSON.stringify(playlist));
	}, [playlist]);
}
