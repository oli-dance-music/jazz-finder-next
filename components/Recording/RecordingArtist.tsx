'use client';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

type Props = {
	artist: string;
	instruments: string[];
	className?: string;
};
/**
 * Renders a link to search for a recording artist with the specified name and instruments.
 *
 * @param {Props} props - The properties for the RecordingArtist component.
 * @param {string} props.artist - The name of the recording artist.
 * @param {string[]} props.instruments - The instruments played by the recording artist.
 * @param {string} [props.className] - The CSS class name for the link element.
 * @return {JSX.Element} The link element that triggers a search for the recording artist.
 */
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
