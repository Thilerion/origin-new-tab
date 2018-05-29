import Vue from 'vue'
import Vuex from 'vuex'

import Wallpaper from './Wallpaper'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		Wallpaper
	}
})
