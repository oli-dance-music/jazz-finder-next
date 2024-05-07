import Link from 'next/link';
import type { ReactNode } from 'react';

//TODO link back including search params

type Props = {
	children: ReactNode;
};
export default function layout({ children }: Props) {
	return (
		<>
			{children}
			<Link href="/recordings">Back to the finder</Link>
		</>
	);
}
