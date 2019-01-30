const storeMixins = {
	empty: {
		state: {},
		getters: {},
		mutations: {},
		actions: {}
	},
	test2: {
		state: {
			test: true,
			really: "Yes"
		},
		getters: {
			isTest: state => !!state.test,
			isReallyTest: state => state.really
		}
	}
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