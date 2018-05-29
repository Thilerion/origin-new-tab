import Vue from 'vue'
import Vuex from 'vuex'

import Background from './Background'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		Background
	}
})
