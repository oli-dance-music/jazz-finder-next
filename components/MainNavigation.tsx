'use client';

import { useToggle } from '@/hooks/useToggle';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { CgCloseO, CgMenuRound } from 'react-icons/cg';

/* Hier noch den Typ LinkTarget erstellen und sicherstellen,
dass die Objekte in linkTargets diesem Typ entsprechen. */

type LinkTarget = {
	text: string;
	url: string;
};

const linkTargets = [
	{
		text: 'Start',
		url: '/',
	},
	{
		text: 'Jazz Finder',
		url: '/recordings',
	},
] satisfies LinkTarget[];

/* 
Barrierefreies Menü:
https://inclusive-components.design/menus-menu-buttons/
*/

export default function MainNavigation() {
	const pathname = usePathname();

	const [isOpen, toggleMenu, , , closeMenu] = useToggle(false);
	/* Wenn pathname sich ändert, soll das Menü geschlossen werden. */
	useEffect(closeMenu, [pathname, closeMenu]);

	return (
		<nav className="main-navigation">
			<button
				onClick={toggleMenu}
				className="main-navigation__button"
				aria-expanded={isOpen}
				aria-label={isOpen ? 'Menü schließen' : 'Menü öffnen'}
			>
				Menü {isOpen ? <CgCloseO /> : <CgMenuRound />}
			</button>
			{isOpen && (
				<ul className="main-navigation__list">
					{getMenuItems(linkTargets, pathname)}
				</ul>
			)}
		</nav>
	);
}

function getMenuItems(linkTargets: LinkTarget[], pathname: string) {
	/* Alle Link-Elemente sollen die CSS-Klasse main-navigation__link
    erhalten, zusätzlich soll das Link-Element, das der aktuell angezeigten
    Seite entspricht, die Klasse main-navigation__link--current erhalten */

	return linkTargets.map(({ text, url }) => {
		const isCurrentPage = url === pathname;

		/* 		const cssClasses = `main-navigation__link ${
			isCurrentPage ? 'main-navigation__link--current' : ''
		}`; */

		/* Etwas komplizierter Ansatz, um ein Attribut gar nicht oder mit
		einem bestimmten Wert in ein Element zu geben, ohne TS-Fehler oder
		ungültiges HTML zu erzeugen. (Bei vielen Attributen kann man false als
		Wert setzen, React lässt das Attribut dann weg, aber bei aria-current
		ist false ein gültiger Wert.)
		https://tink.uk/using-the-aria-current-attribute/  */
		const attributes = isCurrentPage
			? ({ 'aria-current': 'page' } as const)
			: {};

		return (
			<li key={url}>
				<Link className="main-navigation__link" href={url} {...attributes}>
					{text}
				</Link>
			</li>
		);
	});
}
