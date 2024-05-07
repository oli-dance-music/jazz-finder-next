'use client';
import { useState, type ReactNode } from 'react';
import classes from './Toggle.module.css';

type Props = {
	title: string;
	children: ReactNode;
};

export default function Toggle({ title, children }: Props) {
	const [toggle, setToggle] = useState(false);
	return (
		<div className={classes.toggle}>
			<button
				className={classes.toggleButton}
				onClick={() => setToggle(!toggle)}
			>
				{toggle ? '[-]' : '[+]'} {title}
			</button>
			{toggle && <div className={classes.toggleContent}>{children}</div>}
		</div>
	);
}
