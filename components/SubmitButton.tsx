'use client';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

/*
Für die Verwendung von useFormStatus() muss die Komponente
innerhalb eines <form> Elements liegen und eine eigenständige
Client-Komponente sein.
https://react.dev/reference/react-dom/hooks/useFormStatus */

/* 
Im Button soll als default "Absenden" oder "Warten…" stehen, je
nachdem, ob pending false oder true ist.
Der Inhalt des Buttons soll aber konfigurierbar sein,  nutzt
dafür zwei Props: readyContent und pendingContent. Diese sollen
alles enthalten können, was in React dargestellt werden kann.
*/

type Props = {
	readyContent?: ReactNode;
	pendingContent?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

/* Rest und Spread-Syntax wird verwendet, um dem HTML-Element
alle weiteren möglichen Attribute zukommen zu lassen, ohne
dass dafür eigene Props geschrieben werden. */
export default function SubmitButton({
	readyContent = 'Absenden',
	pendingContent = 'Warten…',
	...atts
}: Props) {
	const { pending } = useFormStatus();

	return (
		<button type="submit" disabled={pending} {...atts}>
			{pending ? pendingContent : readyContent}
		</button>
	);
}
