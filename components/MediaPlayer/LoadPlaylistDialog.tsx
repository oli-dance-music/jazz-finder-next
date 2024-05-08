import { type PlaylistType, type Recording } from '@/types/media';
import Dialog from '../primitives/Dialog/Dialog';
import SubmitButton from '../SubmitButton';
import { useFormState } from 'react-dom';
import { loadPlaylists } from '@/components/MediaPlayer/mediaPlayerSeverActions';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import prisma from '@/prisma/db';
import type { Playlist } from '@prisma/client';
import { useMediaContext } from '@/lib/reducer/media';

type Props = {
	disabled?: boolean;
};
export default function LoadPlaylistDialog() {
	const [{ playlist }, mediaDispatch] = useMediaContext()!;
	const [playlists, setPlaylists] = useState<Playlist[] | null>(null);
	const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
		null
	);
	useEffect(() => {
		const doLoadPlaylists = async () => {
			const playlists = await loadPlaylists();
			if (playlists.length) {
				setPlaylists(playlists);
			}
		};
		doLoadPlaylists();
	}, [playlist]);

	return (
		<Dialog closeOnOutsideClick={false} showButtonContent="Open">
			<h3>Load Playlist</h3>
			{playlists === null ? (
				<p>Loading...</p>
			) : (
				<>
					<select
						name="playlist"
						id="playlist"
						onChange={(e) =>
							setSelectedPlaylist(
								e.target.value === ''
									? null
									: (JSON.parse(e.target.value) as Playlist)
							)
						}
					>
						<option value={''}>Select a playlist...</option>
						{playlists.map((playlist) => (
							<option key={playlist.id} value={JSON.stringify(playlist)}>
								{playlist.name}
							</option>
						))}
					</select>
					<button
						type="submit"
						disabled={selectedPlaylist === null}
						onClick={() => {
							console.log('loadPlaylist', selectedPlaylist);
							mediaDispatch({
								action: 'loadPlaylist',
								payload: selectedPlaylist as Playlist,
							});
							//TODO find a way to close Dialog modal
						}}
					>
						Open
					</button>
				</>
			)}
		</Dialog>
	);
}
