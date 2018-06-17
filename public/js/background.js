chrome.runtime.onInstalled.addListener((details, prevVersion) => {
	const curVersion = chrome.runtime.getManifest().version;
	if (details.reason === "install") {
		console.log("Installed!");
		console.log(`Version ${curVersion} has been installed of Origin New Tab.`);
	} else if (details.reason === "update") {
		console.log("Update!");
		console.log(`Origin New Tab has been updated from ${prevVersion} to ${curVersion}.`);
	}
	window.localStorage.setItem('sp_app_version', curVersion);
});

chrome.browserAction.onClicked.addListener(() => {
	chrome.tabs.create({
		url: 'index.html'
	})
})