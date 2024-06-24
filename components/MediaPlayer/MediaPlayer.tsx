'use client';
import classes from './MediaPlayer.module.css';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useMediaContext } from '@/lib/reducer/media';
import type { Recording as RecordingType } from '@/types/media';

/**
 * Renders a media player component that allows the user to play a playlist of recordings.
 *
 * @return {JSX.Element} The rendered media player component.
 */
export default function MediaPlayer() {
	const [{ playing, playlist }, mediaDispatch] = useMediaContext()!;
	const recordings = playlist.recordings as RecordingType[] | [];

	/**
	 * Handles the media player actions based on the provided action.
	 *
	 * @param {string} action - The action to be performed on the media player.
	 * @return {void} This function does not return a value.
	 */
	const handleMediaPlayer = (action: string) => {
		//if there is no playlist, we dont need to do anything
		if (!recordings.length) return;

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
						Playing: {recordings[playing].Artist} - {recordings[playing].Title}
					</>
				) : (
					<> No song is playing </>
				)}
			</div>
			<AudioPlayer
				customAdditionalControls={[]}
				src={playing !== null ? recordings[playing].src : ''}
				showSkipControls
				onPlayError={() => handleMediaPlayer('startPlaylist')}
				onClickNext={() => handleMediaPlayer('next')}
				onClickPrevious={() => handleMediaPlayer('previous')}
				onEnded={() => handleMediaPlayer('next')}
			/>
		</div>
	);
}
