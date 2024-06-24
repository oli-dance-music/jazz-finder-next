'use client';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

type Props = {
	readyContent?: ReactNode;
	pendingContent?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Renders a submit button that can be disabled based on the pending state of a form.
 *
 * @param {Props} props - The component props.
 * @param {ReactNode} [props.readyContent='Absenden'] - The content to display when the form is not pending.
 * @param {ReactNode} [props.pendingContent='Warten…'] - The content to display when the form is pending.
 * @param {ButtonHTMLAttributes<HTMLButtonElement>} atts - Additional button attributes.
 * @return {JSX.Element} The rendered submit button.
 */
export default function SubmitButton({
	readyContent = 'Send',
	pendingContent = 'Wait…',
	...atts
}: Props) {
	const { pending } = useFormStatus();

	return (
		<button type="submit" disabled={pending} {...atts}>
			{pending ? pendingContent : readyContent}
		</button>
	);
}
