import type {
	MediaReducer,
	MediaReducerContext,
	MediaReducerMessage,
	Recording,
} from '@/types/media';
import { createContext, useContext, useReducer } from 'react';

export const MediaContext = createContext<MediaReducerContext>(null);

export function useMediaContext() {
	return useContext(MediaContext);
}

export function mediaReducer(
	media: MediaReducer,
	message: MediaReducerMessage
) {
	// fir emptying playlist we dont need the logic afterwards
	if (message.action === 'emptyPlaylist') {
		return {
			playing: null,
			playlist: [],
		};
	}
	//check if song is already in playlist
	let playlistIndex = media.playlist.findIndex(
		({ IDX }) => IDX === message.payload!.IDX
	);
	const AddToPlaylist = playlistIndex < 0;
	let newPlaying;

	switch (message.action) {
		case 'play':
			//if song is not in playlist, we add it and set the index to playlist.length
			if (AddToPlaylist) {
				playlistIndex = media.playlist.length;
			}
			return {
				playing: playlistIndex,
				playlist: AddToPlaylist
					? [...media.playlist, message.payload]
					: media.playlist,
			};
		case 'addToPlaylist':
			return {
				...media,
				playlist: AddToPlaylist
					? [...media.playlist, message.payload]
					: media.playlist,
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
					if (media.playlist.length <= 1) {
						newPlaying = null;
					} else if (media.playlist.length == media.playing + 1) {
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
				playlist: media.playlist.filter(
					({ IDX }) => IDX !== message.payload!.IDX
				),
			};
	}
}

export function useMediaReducer() {
	return useReducer(mediaReducer, getInitialMedia());
}

export function getInitialMedia(): MediaReducer {
	let playlist: Recording[] | null = null;

	//console.log('initial playlist');

	try {
		const playlistString = localStorage.getItem('playlist');
		if (playlistString !== null) {
			playlist = JSON.parse(playlistString) as Recording[];
			playlist = Array.isArray(playlist) ? playlist : [];
		} else {
			playlist = [];
		}
	} catch {
		console.log('Fehlerhafte Daten. Resetting playlist');
		playlist = [];
	}

	//console.log(playlist);

	return {
		playing: null,
		playlist,
	} as MediaReducer;
}
