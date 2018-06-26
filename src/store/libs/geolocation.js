function getPosition() {
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(({ coords }) => {
			console.log(coords);
			const { latitude, longitude } = coords;
			resolve({ latitude, longitude });
		}, (err) => {
			console.warn("Error in retrieving location. ", err);
			reject(err);
		}, { timeout: 20000, enableHighAccuracy: true });
	})
}

export default getPosition;