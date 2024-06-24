import { useState, useEffect } from 'react';

/**
 * Returns a debounced value of the input value.
 *
 * https://dmitripavlutin.com/controlled-inputs-using-react-hooks/

 * 
 * @param {Type} value - The input value.
 * @param {number} wait - The delay in milliseconds for debouncing.
 * @return {Type} The debounced value.
 */
export function useDebouncedValue<Type>(value: Type, wait: number) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const id = setTimeout(() => setDebouncedValue(value), wait);
		return () => clearTimeout(id);
	}, [value]);

	return debouncedValue;
}
