/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog

/* Siehe auch die popover-API mit der Elemente ohne JS als Popover dargestellt
werden können, allerdings nicht im modal-Modus.
https://developer.mozilla.org/en-US/docs/Web/API/Popover_API */

import { useRef, type MouseEventHandler, type ReactNode } from 'react';

type Props = {
	children?: ReactNode;
	closeOnOutsideClick?: boolean;
	showButtonContent?: ReactNode;
	disabled?: boolean;
};
export default function Dialog({
	children,
	closeOnOutsideClick = true,
	showButtonContent,
	disabled = false,
}: Props) {
	/* Wenn man später garantiert die Referenz auf ein HTML-Element setzt,
  kann mit mit null! TS mitteilen, dass in dialogRef.current nicht null
  sein wird, und man muss später nicht immer auf null prüfen. */
	const dialogRef = useRef<HTMLDialogElement>(null!);

	const openDialog = () => dialogRef.current.showModal();
	const closeDialog = () => dialogRef.current.close();

	/* 

	1. Gebt der Funktion handleOutsideClick eine Typen. Der Typ kann ermittelt werden,
	wenn man mit die Maus über das onClick-Attribut von dialog bewegt.
	 
  2. Prüft, ob der Klick auf einem HTML-Element aufgetreten ist, falls nein, verlasst
  die Funktion.

  3. Prüft mit der closest-Methode, ob der Klick innerhalb von .modal__inner aufgetreten
  ist. Falls ja, verlasst die Funktion. Falls nein, schließt das Dialog-Element.

  4. Bonus: Gebt der Komponente einen Prop namens closeOnOutsideClick, welcher
  true als default-Wert hat. Falls closeOnOutsideclick false ist, soll bei einem
  Klick außerhalb das Dialog-Element nicht geschlossen werden.
  */
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
			{/* 		<button popovertarget="mypopover">Toggle the popover</button>
			<div id="mypopover" popover="">
				Popover content
			</div> */}

			<button onClick={openDialog} disabled={disabled}>
				{showButtonContent || 'Weitere Informationen'}
			</button>
			<dialog ref={dialogRef} className="modal" onClick={handleOutsideClick}>
				<div className="modal__inner">
					<button onClick={closeDialog} className="modal__close">
						&times;
					</button>
					{/* Hier soll der Inhalt dargestellt werden, der zwischen der
				öffnenden und schließenden Dialog-Komponente steht. */}
					{children}
				</div>
			</dialog>
		</div>
	);
}
