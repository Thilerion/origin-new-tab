import loadImage from './loadImage';

async function getFavicon(url) {
	const defaultImage = require('@/assets/logo.png');
	if (process.env.NODE_ENV === 'development') {
		return defaultImage;
	}
	try {
		const domain = new URL(url).origin;
		const faviconUrl = `chrome://favicon/size/32/${domain}`;
		const loader = await loadImage(faviconUrl);
		return loader.url;
	} catch (e) {
		return defaultImage;
	}
}

export default getFavicon;