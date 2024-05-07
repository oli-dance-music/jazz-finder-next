import MainNavigation from './MainNavigation';
import { GiTrombone } from 'react-icons/gi';

export default function Header() {
	return (
		<header className="site-header">
			<div className="site-header__title">
				<GiTrombone /> Jazz Finder
			</div>
			<MainNavigation />
		</header>
	);
}
