const storeMixins = {
	externalAPI: (validateFn, fetchApiDataFn) => ({
		state: {
			expires: null,

			finishedLoading: false,
			dataStatus: null
		},
		getters: {
			toWatch: state => ({ data: state.data, expires: state.expires }),
			hasExpired: state => state.expires != null && (state.expires - Date.now() < 0),
			
			dataLoadSuccessful: state => state.dataStatus != null && state.finishedLoading,
			dataLoadFailed: state => state.dataStatus === null && state.finishedLoading,

			dataInvalid: state => !!validateFn(state)
		},
		mutations: {
			setData(state, { data, expires }) {
				state.data = { ...data };
				state.expires = expires;
			},
			setFinishedLoading(state, bool) {
				state.finishedLoading = !!bool;
			},
			setDataStatus(state, status) {
				state.dataStatus = status;
			}
		},
		actions: {
			async storageLoadFail({ commit, dispatch }) {
				await dispatch('fetchApiData');
				commit('setFinishedLoading', true);
			},
			async storageLoadSuccess({ getters, commit, dispatch }, data) {
				dispatch('setLocalData', data);
				if (getters.hasExpired || getters.dataInvalid) {
					commit('setDataStatus', "stale");
					await dispatch('fetchApiData');
				} else {
					commit('setDataStatus', "fresh");
				}
				commit('setFinishedLoading', true);
			},
			setLocalData({commit}, data) {
				commit('setData', data);
			},
			setApiData({commit}, apiData) {
				commit('setData', apiData);
				commit('setDataStatus', "fresh");
			},
			// TODO: must be done this way for now because certain
			// TODO: params must be sent to ApiRequest function
			fetchApiData: fetchApiDataFn
		}
	}),
}

// Create enum variable for the storeMixins keys
const MIXIN_TYPES = Object.freeze(Object.keys(storeMixins)); //?

export {
	MIXIN_TYPES,
	storeMixins
};