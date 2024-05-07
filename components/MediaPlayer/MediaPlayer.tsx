'use client';
import classes from './MediaPlayer.module.css';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useMediaContext } from '@/lib/reducer/media';
import List from '../primitives/List/List';
import RecordingTeaser from '../Recording/RecordingTeaser';
import { Suspense, useEffect } from 'react';
import Card from '../primitives/Card/Card';
import useConfirm from '@/hooks/useConfirm';
import type { Recording as RecordingType } from '@/types/media';
//import { useHeaderContext } from '../Header';

export default function MediaPlayer() {
	const [{ playing, playlist }, mediaDispatch] = useMediaContext()!;

	/* const [title, setTitle] = useHeaderContext(); */

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
		}
	};

	return (
		<div className={classes.mediaPlayer}>
			<div className={classes.playerStatus}>
				{playing !== null ? (
					<>
						{/* <Helmet>
							<title>🎵 {playlist[playing].Title} - Jazz Finder</title>
						</Helmet> */}
						Playing: {playlist[playing].Artist} - {playlist[playing].Title}
					</>
				) : (
					<> No song is playing </>
				)}
			</div>
			<AudioPlayer
				customAdditionalControls={[]}
				src={playing !== null ? playlist[playing].src : ''}
				showSkipControls
				onPlayError={() => handleMediaPlayer('startPlaylist')}
				onClickNext={() => handleMediaPlayer('next')}
				onClickPrevious={() => handleMediaPlayer('previous')}
				onEnded={() => handleMediaPlayer('next')}
			/>
		</div>
	);
}
