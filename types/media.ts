import type { Playlist } from '@prisma/client';
import type { Dispatch } from 'react';

export type Recording = {
	IDX: number;
	Artist: string;
	Title: string;
	PEOPLE: Performer;
	Year: string;
	//Month: string;
	//Day: string;
	Record: string;
	URL?: string;
	url: string;
	SRC: { Date: string; Performers: string };
	rawData: object;
	src: string;
};

type Performer = {
	name: string[];
	[key: string]: string[];
};

export type PlaylistType = {
	recordings: Recording[];
	id?: string;
	created?: Date;
	updated?: Date;
	name?: string;
	public?: boolean;
	userId?: string;
};
/* | Playlist; */

export type MediaReducer = {
	playing: number | null;
	playlist: PlaylistType;
};

export type MediaReducerMessage =
	| { action: 'emptyPlaylist' }
	| { action: 'play'; payload: Recording }
	| { action: 'addToPlaylist'; payload: Recording }
	| { action: 'removeFromPlaylist'; payload: Recording }
	| { action: 'loadPlaylist'; payload: Playlist };
/* | {
			action: 'updatePlaylist';
			payload: {
				id?: string;
				name?: string;
			};
	  }; */

export type MediaReducerContext =
	| [MediaReducer, Dispatch<MediaReducerMessage>]
	| null;
