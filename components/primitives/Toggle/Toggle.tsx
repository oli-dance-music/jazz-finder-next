'use client';
import { useState, type ReactNode } from 'react';
import classes from './Toggle.module.css';

type Props = {
	title: string;
	children: ReactNode;
};

/**
 * Renders a toggle component with a button that toggles a state when clicked.
 *
 * @param {string} title - The title of the toggle component.
 * @param {ReactNode} children - The content to be displayed inside the toggle component.
 * @return {JSX.Element} The rendered toggle component.
 */
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
