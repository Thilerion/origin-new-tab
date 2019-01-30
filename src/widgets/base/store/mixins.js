const storeMixins = {
	// TODO: maybe constructors that adds Widget API function etc
	externalAPI: {
		state: {
			expires: null,
			finishedLoading: false,
			dataStatus: null
		},
		getters: {

		}
	},

	// TODO: maybe make it a function that adds paths to persist (with _get())
	// persist: {
	// 	getters: {
	// 		toWatch: state => {
	// 			return { expires: state.expires, data: state.data };
	// 		}
	// 	}
	// },

	// TODO: definitely make this a function that accepts paths,
	// TODO: 	and actions for when the settings change,
	// TODO:	should contain a reducer for the received settings
	// TODO: a normal store plugin should watch when settings change,
	// TODO: 	and notify each widget if they changed
	// actionOnSettingsChange: {
	// 	actions(ctx, mySettings) {
	// 		console.log("I reduce 'mySettings' based on certain paths");
	// 		console.log("I must do something when those settings change");
	// 	}
	// }
};

// Prevents new properties from being added, or existing properties to be modified
// The objects inside can still be changed however
Object.seal(storeMixins);

// Create enum variable for the storeMixins keys
const MIXIN_TYPES = Object.freeze(Object.keys(storeMixins)); //?

export {
	MIXIN_TYPES,
	storeMixins
};