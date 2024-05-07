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
const Card = ({ children }: Props) => {
	const [toggle, setToggle] = useState(false);

	return (
		<CardContext.Provider value={[toggle, setToggle]}>
			<div className={classes.card}>{children}</div>
		</CardContext.Provider>
	);
};

const Header = (props: Props) => (
	<div className={classes.cardHeader}>{props.children}</div>
);
Card.Header = Header;

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

const Body = (props: Props) => {
	const [toggle] = useContext(CardContext)!;

	return (
		<>{toggle && <div className={classes.cardBody}>{props.children}</div>}</>
	);
};
Card.Body = Body;

export default Card;
