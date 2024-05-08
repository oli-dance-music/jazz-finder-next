import type {
	MediaReducer,
	MediaReducerContext,
	MediaReducerMessage,
	PlaylistType,
	Recording,
} from '@/types/media';
import type { Playlist } from '@prisma/client';
import { createContext, useContext, useReducer } from 'react';

export const MediaContext = createContext<MediaReducerContext>(null);

export function useMediaContext() {
	return useContext(MediaContext);
}

export function mediaReducer(
	media: MediaReducer,
	message: MediaReducerMessage
) {
	const recordings = media.playlist.recordings as Recording[] | [];

	// fir emptying playlist we dont need the logic afterwards
	if (message.action === 'emptyPlaylist') {
		return {
			playing: null,
			playlist: {
				name: undefined,
				id: undefined,
				recordings: [],
			},
		};
	}
	let playlistIndex = 0;
	if (
		message.action !== 'loadPlaylist' /*  &&
		message.action !== 'updatePlaylist' */
	) {
		//check if song is already in playlist
		playlistIndex = recordings.findIndex(
			({ IDX }) => IDX === message.payload!.IDX
		);
	}
	const AddToPlaylist = playlistIndex < 0;
	let newPlaying;

	switch (message.action) {
		case 'play':
			console.log('play for go sae');
			//if song is not in playlist, we add it and set the index to playlist.length
			if (AddToPlaylist) {
				playlistIndex = recordings.length;
			}
			return {
				playing: playlistIndex,
				playlist: {
					...media.playlist,
					recordings: AddToPlaylist
						? [...recordings, message.payload]
						: recordings,
				},
			};
		case 'addToPlaylist':
			return {
				...media,
				playlist: {
					...media.playlist,
					recordings: AddToPlaylist
						? [...recordings, message.payload]
						: recordings,
				},
			};
		case 'removeFromPlaylist':
			/* check if removing the song will affect the currently playing song. 
				- If no song is playing, we dont need to do anything
				- the the removed song is currently playing, it will strt the next song (playing key stays the same)
				- if the removed song is the currently playing song and the only song in the playlist, we set the playing song to null
				- if the song being removed is above the currently playing song, we need to decrement the playing song index
			*/
			newPlaying = media.playing!;
			if (media.playing !== null) {
				if (playlistIndex === media.playing) {
					if (recordings.length <= 1) {
						newPlaying = null;
					} else if (recordings.length == media.playing + 1) {
						// reset to first song if currently playing is the last song
						newPlaying = 0;
					}
				} else {
					if (playlistIndex < media.playing) {
						newPlaying--;
					}
				}
			}
			return {
				playing: newPlaying,
				playlist: {
					...media.playlist,
					recordings: recordings.filter(
						({ IDX }) => IDX !== message.payload!.IDX
					),
				},
			};
		case 'loadPlaylist':
			return {
				playing: null,
				playlist: {
					name: message.payload.name,
					id: message.payload.id,
					recordings: JSON.parse(
						message.payload.recordings as string
					) as Recording[],
				},
			};
		/* case 'updatePlaylist':
			return {
				playing: newPlaying,
				playlist: {
					...media.playlist,
					name: message.payload.name,
					id: message.payload.id,
				},
			}; */
	}
}

export function useMediaReducer() {
	return useReducer(mediaReducer, getInitialMedia());
}

export function getInitialMedia(): MediaReducer {
	let playlist: PlaylistType = { recordings: [] };

	//console.log('initial playlist');

	try {
		//console.log('loading playlist from local storage');
		const playlistString = localStorage.getItem('playlist');
		if (playlistString !== null) {
			playlist = JSON.parse(playlistString) as PlaylistType;
		} else {
			playlist = { recordings: [] };
		}
	} catch {
		//console.log('Fehlerhafte Daten. Resetting playlist');
		playlist = { recordings: [] };
	}

	console.log(playlist);

	return {
		playing: null,
		playlist,
	} as MediaReducer;
}
