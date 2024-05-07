import type { ReactNode } from 'react';
import classes from './List.module.css';

type Props = {
	children: ReactNode;
};

export default function List({ children }: Props) {
	return <div className={classes.list}>{children}</div>;
}
