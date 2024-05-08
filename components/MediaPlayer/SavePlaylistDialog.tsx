import type { PlaylistType, Recording } from '@/types/media';
import Dialog from '../primitives/Dialog/Dialog';
import SubmitButton from '../SubmitButton';
import { useFormState } from 'react-dom';
import { savePlaylist } from '@/components/MediaPlayer/mediaPlayerSeverActions';
import { useEffect, useRef, useState } from 'react';
import { useMediaContext } from '@/lib/reducer/media';

type Props = {
	disabled?: boolean;
};

/*
    TODO
    - When saving a new playlist, the name and id are not updating in the reducer state 
    - When saving a new playlist after loading another one, the one loaded is overwritten, likely because the state management of the id is missing
    - Clean success message, when the modal is closed
*/
export default function SavePlaylistDialog({ disabled }: Props) {
	const [{ playlist }, mediaDispatch] = useMediaContext()!;
	const recordings = playlist.recordings as Recording[];

	const [name, setName] = useState(playlist.name);

	useEffect(() => {
		console.log(playlist.name);
		setName(playlist.name ?? '');
	}, [playlist.name]);

	const formRef = useRef<null | HTMLFormElement>(null);

	const [formState, formAction] = useFormState(savePlaylist, {
		message: '',
		status: '',
		playlistId: '',
		//playlist: null,
	});

	if (formState.status === 'success') {
		console.log(formState.playlistId);
		/* mediaDispatch({
			action: 'updatePlaylist',
			payload: { id: formState.playlist!.id!, name: formState.playlist!.name },
		}); */
		//formState.status = '';
	}

	return (
		<Dialog
			closeOnOutsideClick={false}
			showButtonContent="Save"
			disabled={disabled}
		>
			<h3> {playlist.id ? 'Update Existing' : 'Save New'} Playlist</h3>
			<form action={formAction} ref={formRef}>
				<div>
					<label htmlFor="name">Name</label>
					<input
						id="name"
						name="name"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<label>
					<input type="checkbox" name="public" id="public" value="on" />
					make public
				</label>
				<br />
				<input type="hidden" name="id" value={playlist.id} />
				<input
					type="hidden"
					name="recordings"
					value={JSON.stringify(recordings)}
				/>
				<input
					type="hidden"
					name="userId"
					value="4e9a78db-3f6e-4a2e-b5b2-13f1bfb72b34"
				/>{' '}
				<SubmitButton />
				<strong aria-live="polite">{formState.message}</strong>
				{/* 
                //TODO find a way to close Dialog modal
                {formState.status === 'success' && (
					<p>
						<Link href={`/playlists/${formState.playlistId}`}>
							Go to Playlist
						</Link>
					</p>
				)} */}
			</form>
		</Dialog>
	);
}
