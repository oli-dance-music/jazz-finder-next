'use client';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

type Props = {
	artist: string;
	instruments: string[];
	className?: string;
};
export default function RecordingArtist({
	artist,
	instruments,
	className,
}: Props) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	function handleArtistSearch() {
		const urlSearchParams = new URLSearchParams(searchParams);
		urlSearchParams.set('searchTerm', artist);
		urlSearchParams.set('currentPage', '1');

		replace(`${pathname}?${urlSearchParams.toString()}`);
	}

	return (
		<a className={className} href="#" onClick={handleArtistSearch}>
			{artist} ({instruments.join(', ')})
		</a>
	);
}
