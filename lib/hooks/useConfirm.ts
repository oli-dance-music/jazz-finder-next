/**
 * A hook that provides a confirmation dialog based on the message provided.
 *
 * @param {string} message - The message to be displayed in the confirmation dialog.
 * @param {() => void} onConfirm - The function to be executed when the user confirms.
 * @param {() => void} onAbort - The function to be executed when the user aborts the confirmation.
 * @return {() => void} The confirm function that triggers the confirmation dialog.
 */
export default function useConfirm(
	message: string,
	onConfirm: () => void,
	onAbort = () => {}
) {
	/**
	 * Executes the provided `onConfirm` function if the user confirms the message
	 * displayed in the confirmation dialog, otherwise it executes the provided `onAbort` function.
	 *
	 * @return {void} This function does not return anything.
	 */
	const confirm = () => {
		if (window.confirm(message)) onConfirm();
		else onAbort();
	};
	return confirm;
}
