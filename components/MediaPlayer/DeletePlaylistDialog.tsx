import type { PlaylistType, Recording } from '@/types/media';
import Dialog from '../primitives/Dialog/Dialog';
import SubmitButton from '../SubmitButton';
import { useFormState } from 'react-dom';
import {
	deletePlaylist,
	savePlaylist,
} from '@/components/MediaPlayer/mediaPlayerSeverActions';
import { useEffect, useRef, useState } from 'react';
import { useMediaContext } from '@/lib/reducer/media';

type Props = {
	disabled?: boolean;
};

/*
    TODO
    - Clean success message, when the modal is closed
*/
export default function DeletePlaylistDialog({ disabled }: Props) {
	const [{ playlist }, mediaDispatch] = useMediaContext()!;

	const formRef = useRef<null | HTMLFormElement>(null);

	const [formState, formAction] = useFormState(deletePlaylist, {
		message: '',
		status: '',
	});

	if (formState.status === 'success') {
		mediaDispatch({
			action: 'emptyPlaylist',
		});
		formState.status = '';
	}

	return (
		<Dialog
			closeOnOutsideClick={false}
			showButtonContent="Delete"
			disabled={disabled}
		>
			<h3>Delete Playlist</h3>
			<form action={formAction} ref={formRef}>
				<input type="hidden" name="id" value={playlist.id} />

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
