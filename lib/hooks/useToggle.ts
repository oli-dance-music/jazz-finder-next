import { useState, useCallback } from 'react';

/**
 * Returns a tuple containing the current state, a toggle function, a state setter,
 * a function to set the state to true, and a function to set the state to false.
 *
 * @param {boolean} initialState - The initial state of the toggle.
 * @return {[boolean, () => void, Dispatch<SetStateAction<boolean>>, () => void, () => void]} - A tuple containing the current state, a toggle function, a state setter,
 * a function to set the state to true, and a function to set the state to false.
 */
export function useToggle(initialState: boolean) {
	const [state, setState] = useState(initialState);

	const toggle = useCallback(
		() => setState((currentState) => !currentState),
		[]
	);

	const setTrue = useCallback(() => setState(true), []);
	const setFalse = useCallback(() => setState(false), []);

	return [state, toggle, setState, setTrue, setFalse] as const;
}
