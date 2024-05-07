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

export type MediaReducer = {
	playing: number | null;
	playlist: Recording[];
};

export type MediaReducerMessage =
	| { action: 'emptyPlaylist' }
	| { action: 'play'; payload: Recording }
	| { action: 'addToPlaylist'; payload: Recording }
	| { action: 'removeFromPlaylist'; payload: Recording };

export type MediaReducerContext =
	| [MediaReducer, Dispatch<MediaReducerMessage>]
	| null;
