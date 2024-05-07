'use client';
import { type ReactNode } from 'react';
import { MediaContext, useMediaReducer } from '@/lib/reducer/media';
import dynamic from 'next/dynamic';

const MediaPlayer = dynamic(
	() => import('@/components/MediaPlayer/MediaPlayer'),
	{ ssr: false }
);

const MediaPlayerPlaylist = dynamic(
	() => import('@/components/MediaPlayer/MediaPlayerPlaylist'),
	{ ssr: false }
);

type Props = { children: ReactNode };
export default function DefaultLayout({ children }: Props) {
	const [media, mediaDispatch] = useMediaReducer();

	return (
		<>
			<MediaContext.Provider value={[media, mediaDispatch]}>
				<main className="default-layout">{children}</main>
				<div className="media-player">
					<MediaPlayer />
					<MediaPlayerPlaylist />
				</div>
			</MediaContext.Provider>
		</>
	);
}
