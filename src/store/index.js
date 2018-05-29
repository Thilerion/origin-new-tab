import Vue from 'vue'
import Vuex from 'vuex'

import Wallpaper from './Wallpaper'
import Welcome from './Welcome'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		Wallpaper,
		Welcome
	}
})
