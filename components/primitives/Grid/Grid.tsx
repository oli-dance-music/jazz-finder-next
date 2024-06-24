import type { ReactNode } from 'react';
import classes from './Grid.module.css';

type Props = {
	children: ReactNode;
};
/**
 * Renders a grid component with the provided children.
 *
 * @param {Props} props - The properties for the Grid component.
 * @param {ReactNode} props.children - The content to be rendered inside the grid.
 * @return {JSX.Element} The rendered Grid component.
 */
export default function Grid({ children }: Props) {
	return <div className={classes.grid}>{children}</div>;
}
