import Link from 'next/link';

export default function Home() {
	return (
		<>
			<h1>Welcome to the Next Jazz App!</h1>
			<Link href="/recordings">Go to the Jazz Finder</Link>
		</>
	);
}
