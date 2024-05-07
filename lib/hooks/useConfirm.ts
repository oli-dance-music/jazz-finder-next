export default function useConfirm(
	message: string,
	onConfirm: () => void,
	onAbort = () => {}
) {
	const confirm = () => {
		if (window.confirm(message)) onConfirm();
		else onAbort();
	};
	return confirm;
}
