import { ColorRing } from 'react-loader-spinner';
import classes from './Loader.module.css';

export default function Loader() {
	return (
		<div className={classes.loader}>
			<ColorRing
				visible={true}
				height="80"
				width="80"
				ariaLabel="color-ring-loading"
				wrapperClass={classes.ColorRingWrapper}
			/>
		</div>
	);
}
