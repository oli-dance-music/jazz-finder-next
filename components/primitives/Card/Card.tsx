'use client';
import {
	createContext,
	useContext,
	useState,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
} from 'react';
import classes from './Card.module.css';

type CardContext = [boolean, Dispatch<SetStateAction<boolean>>] | null;
export const CardContext = createContext<CardContext>(null);

type Props = {
	children: ReactNode;
	disabled?: boolean;
};
/**
 * Renders a card component with a toggleable state.
 *
 * @param {Props} props - The props for the Card component.
 * @param {ReactNode} props.children - The content to be rendered inside the card.
 * @param {boolean} [props.disabled] - Optional. If true, the card will be disabled.
 * @return {JSX.Element} The rendered Card component.
 */
const Card = ({ children }: Props) => {
	const [toggle, setToggle] = useState(false);

	return (
		<CardContext.Provider value={[toggle, setToggle]}>
			<div className={classes.card}>{children}</div>
		</CardContext.Provider>
	);
};

/**
 * Renders a header component for a card.
 *
 * @param {Props} props - The props for the Header component.
 * @param {ReactNode} props.children - The content to be rendered inside the header.
 * @return {JSX.Element} The rendered Header component.
 */
const Header = (props: Props) => (
	<div className={classes.cardHeader}>{props.children}</div>
);
Card.Header = Header;

/**
 * Renders a toggle button component with the ability to toggle a state.
 *
 * @param {Props} props - The props for the Toggle component.
 * @return {JSX.Element} The rendered Toggle component.
 */
const Toggle = (props: Props) => {
	const [toggle, setToggle] = useContext(CardContext)!;
	return (
		<button
			className={classes.toggleButton}
			onClick={() => setToggle(!toggle)}
			disabled={props.disabled}
		>
			{toggle ? '[-]' : '[+]'}
			{props.children}
		</button>
	);
};
Card.Toggle = Toggle;

/**
 * Renders the body of a card component based on the toggle state from the CardContext.
 *
 * @param {Props} props - The props for the Body component.
 * @param {ReactNode} props.children - The content to be rendered inside the card body.
 * @return {JSX.Element} The rendered card body element.
 */
const Body = (props: Props) => {
	const [toggle] = useContext(CardContext)!;

	return (
		<>{toggle && <div className={classes.cardBody}>{props.children}</div>}</>
	);
};
Card.Body = Body;

export default Card;
