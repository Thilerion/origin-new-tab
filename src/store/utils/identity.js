import Axios from "axios";

//https://github.com/GoogleDeveloperExperts/chrome-extension-google-apis/blob/master/js/background.js

function promiseGetAuthToken(interactive = false) {
	return new Promise((resolve, reject) => {
		chrome.identity.getAuthToken({ interactive }, token => {
			if (chrome.runtime.lastError) {
				return reject(chrome.runtime.lastError);
			} else resolve(token);
		})
	})
};

// if access token is stale, or invalid, but there IS a token =>
//		removeCachedAuthToken

//if there is no auth token =>
//		getAuthToken

function removeCachedAuthToken(token) {
	return new Promise((resolve, reject) => {
		if (!token) {
			reject("No token!");
			return;
		};

		chrome.identity.removeCachedAuthToken({ token }, () => {
			if (chrome.runtime.lastError) {
				return reject(chrome.runtime.lastError);
			}
			resolve(token);
		})
	})
}

function revokeOauthAccess(token) {
	if (!token) return Promise.reject("No token, so cannot revoke OAuth access!");

	return Axios.get("https://accounts.google.com/o/oauth2/revoke", {
		headers: { 'content-type': 'application/x-www-form-urlencoded' },
		params: { token }
	});
}

export const getAuthTokenInteractive = () => promiseGetAuthToken(true);
export const getAuthTokenSilent = () => promiseGetAuthToken(false);
export { removeCachedAuthToken, revokeOauthAccess };
