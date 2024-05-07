import type { ReactNode } from 'react';
import classes from './Grid.module.css';

type Props = {
	children: ReactNode;
};
export default function Grid({ children }: Props) {
	return <div className={classes.grid}>{children}</div>;
}
