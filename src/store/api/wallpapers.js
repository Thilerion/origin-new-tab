import axios from 'axios';

function getWallpapersFromCollection(collection = 220388, count, w, h) {
	return axios.get(`http://localhost:3000/wallpapers/${collection}`);
}

export { getWallpapersFromCollection };