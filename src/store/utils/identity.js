//https://github.com/GoogleDeveloperExperts/chrome-extension-google-apis/blob/master/js/background.js

function promiseGetAuthToken(interactive = false) {
	return new Promise((resolve, reject) => {
		chrome.identity.getAuthToken({ interactive }, token => {
			if (chrome.runtime.lastError) {
				return reject(chrome.runtime.lastError);
			}
			resolve(token);
		})
	})
};

// if access token is stale, or invalid, but there IS a token =>
//		removeCachedAuthToken

//if there is no auth token =>
//		getAuthToken

const removeCachedAuthToken = function removeCachedAuthToken(token) {
	return new Promise((resolve, reject) => {
		chrome.identity.removeCachedAuthToken({ token }, () => {
			if (chrome.runtime.lastError) {
				return reject(chrome.runtime.lastError);
			}
			resolve();
		})
	})
}

export const getAuthTokenInteractive = () => promiseGetAuthToken(true);
export const getAuthTokenSilent = () => promiseGetAuthToken(false);
export const removeCachedAuthToken;
