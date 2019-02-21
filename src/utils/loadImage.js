export default function loadImage(url) {
	return new Promise((resolve, reject) => {
		const image = new Image();

		let loadTimer;

		let loaded = () => {
			clearTimeout(loadTimer);
			loadTimer = null;
			resolve({ url, image });
		}

		function errorLoading(e) {
			console.warn(e);
			reject("Error loading image");
		}
		function abortedLoading() {
			reject("Loading image was aborted");
		}
		function timedOutLoading() {
			reject("Loading image timed out");
		}
		image.addEventListener('load', loaded);
		image.addEventListener('error', errorLoading);
		image.addEventListener('abort', abortedLoading);
		loadTimer = setTimeout(() => {
			image.removeEventListener('load', loaded);
			image.removeEventListener('error', errorLoading);
			image.removeEventListener('abort', abortedLoading);
			image.src = "";
			timedOutLoading();
		}, 20000);

		image.src = url;
	});
}