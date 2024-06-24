/**
 * Formats a given price in cents to a string representation with a currency symbol.
 *
 * @param {number} price - The price in cents to be formatted.
 * @param {string} [currencySymbol=' €'] - The currency symbol to be appended to the formatted price.
 * @return {string} The formatted price as a string.
 */
export function getFormattedPrice(price: number, currencySymbol = ' €') {
	const formattedPrice =
		(price / 100).toFixed(2).replace('.', ',') + currencySymbol;

	return formattedPrice;
}

/**
 * Retrieves the user's current geolocation using the Geolocation API.
 *
 * @return {Promise<GeolocationPosition>} A promise that resolves with the user's current geolocation.
 */
export function getUserLocation(): Promise<GeolocationPosition> {
	// https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
	const options: PositionOptions = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0,
	};

	return new Promise((resolve, reject) => {
		window.navigator.geolocation.getCurrentPosition(resolve, reject, options);
	});
}

/**
 * Calculates the distance between two sets of geographical coordinates using the Haversine formula.
 *
 * @param {number} lat1 - The latitude of the first coordinate.
 * @param {number} lon1 - The longitude of the first coordinate.
 * @param {number} lat2 - The latitude of the second coordinate.
 * @param {number} lon2 - The longitude of the second coordinate.
 * @param {'K' | 'N' | 'M'} [unit='K'] - The unit of distance to calculate: 'K' for kilometers, 'N' for nautical miles, 'M' for miles.
 * @return {number} The calculated distance between the two coordinates.
 */
export function getDistance(
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number,
	unit: 'K' | 'N' | 'M' = 'K'
) {
	if (lat1 === lat2 && lon1 === lon2) {
		return 0;
	}

	const radlat1 = (Math.PI * lat1) / 180;
	const radlat2 = (Math.PI * lat2) / 180;
	const theta = lon1 - lon2;
	const radtheta = (Math.PI * theta) / 180;
	let dist =
		Math.sin(radlat1) * Math.sin(radlat2) +
		Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	if (dist > 1) {
		dist = 1;
	}
	dist = Math.acos(dist);
	dist = (dist * 180) / Math.PI;
	dist = dist * 60 * 1.1515; // distance in miles

	if (unit == 'K') {
		dist = dist * 1.609344; // distance in kilometers
	} else if (unit == 'N') {
		dist = dist * 0.8684; // distance in nautical miles
	}
	return dist;
}

/**
 * A function that creates a promise that resolves after a specified time.
 *
 * @param {number} ms - The time to wait in milliseconds.
 * @return {Promise<void>} A promise that resolves after the specified time.
 */
export function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
