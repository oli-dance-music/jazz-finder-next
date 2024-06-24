/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog

import { useRef, type MouseEventHandler, type ReactNode } from 'react';

type Props = {
	children?: ReactNode;
	closeOnOutsideClick?: boolean;
	showButtonContent?: ReactNode;
	disabled?: boolean;
};
/**
 * Renders a dialog component with the specified children and functionality to handle outside clicks.
 *
 * @param {Props} children - The content to be rendered inside the dialog.
 * @param {boolean} closeOnOutsideClick - Flag to determine if the dialog should close on outside click.
 * @param {ReactNode} showButtonContent - The content to be displayed on the button that triggers the dialog.
 * @param {boolean} disabled - Flag to disable the button that triggers the dialog.
 * @return {JSX.Element} The rendered dialog component.
 */
export default function Dialog({
	children,
	closeOnOutsideClick = true,
	showButtonContent,
	disabled = false,
}: Props) {
	const dialogRef = useRef<HTMLDialogElement>(null!);

	const openDialog = () => dialogRef.current.showModal();
	const closeDialog = () => dialogRef.current.close();

	const handleOutsideClick: MouseEventHandler<HTMLDialogElement> = (e) => {
		if (!closeOnOutsideClick) {
			return;
		}

		const clickedElement = e.target;

		if (!(clickedElement instanceof HTMLElement)) {
			return;
		}

		if (!clickedElement.closest('.modal__inner')) {
			closeDialog();
		}
	};

	return (
		<div>
			<button onClick={openDialog} disabled={disabled}>
				{showButtonContent || 'Weitere Informationen'}
			</button>
			<dialog ref={dialogRef} className="modal" onClick={handleOutsideClick}>
				<div className="modal__inner">
					<button onClick={closeDialog} className="modal__close">
						&times;
					</button>

					{children}
				</div>
			</dialog>
		</div>
	);
}
