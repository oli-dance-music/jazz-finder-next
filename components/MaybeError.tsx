'use client';

import { useState } from 'react';

import random from 'just-random-integer';

export default function MaybeError() {
	const [number, setNumber] = useState(0);

	const changeNumber = () => {
		const newNumber = random(0, 3);

		if (newNumber === 3) {
			throw new Error('Pech gehabt!');
		}

		setNumber(newNumber);
	};

	return (
		<div>
			<div>{number}</div>
			<button onClick={changeNumber}>Play Russian Roulette</button>
		</div>
	);
}
