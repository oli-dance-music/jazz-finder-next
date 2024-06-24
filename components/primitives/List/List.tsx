import type { ReactNode } from 'react';
import classes from './List.module.css';

type Props = {
	children: ReactNode;
};

/**
 * Renders a list component with the given children.
 *
 * @param {Props} props - The props for the List component.
 * @param {ReactNode} props.children - The content to be rendered inside the list.
 * @return {JSX.Element} The rendered List component.
 */
export default function List({ children }: Props) {
	return <div className={classes.list}>{children}</div>;
}
