function getPosition() {
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject, {
			timeout: 15000,
			enableHighAccuracy: true
		})
	})
};

async function getCoordinates() {
	try {
		const position = await getPosition();
		const latitude = position.coords.latitude;
		const longitude = position.coords.longitude;
		return { latitude, longitude };
	} catch (e) {
		const code = e.code;
		if (code === 1) {
			// No permission
			console.warn("[Geolocation Error 1]: No permission granted.");
		} else if (code === 2) {
			// Location unavailable
			console.warn("[Geolocation Error 2]: Location unavailable.");
		} else if (code === 3) {
			// Timeout expired
			console.warn("[Geolocation Error 3]: Timeout expired.");
		} else {
			console.warn("[Geolocation Error]: unexpected error.\n", e);
		}
		return false;
	}
}



export default getCoordinates;