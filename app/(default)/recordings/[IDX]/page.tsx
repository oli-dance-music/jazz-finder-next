import type { Recording as RecordingType } from '@/types/media';
import Recording from '@/components/Recording/Recording';
import { notFound } from 'next/navigation';

type Props = {
	params: {
		IDX: string;
	};
};
export default async function RecordingPage({ params: { IDX } }: Props) {
	const LOCAL_API_BASE = process.env.LOCAL_API_BASE;

	const apiUrl = `${LOCAL_API_BASE}/api/recordings/${IDX}`;

	const response = await fetch(apiUrl, {
		next: {
			revalidate: 10,
		},
	});

	const recording = (await response.json()) as RecordingType;

	if (!recording.IDX) {
		notFound();
	}

	return (
		<div>
			<h1>{recording.Title}</h1>
			<Recording {...recording} />
		</div>
	);
}
