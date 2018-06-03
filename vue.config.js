/* FOUND ON https://github.com/vuejs/vue-cli/issues/1074

Disable inlining to get around CSP for extensions:

module.exports = {
	chainWebpack: config => {
		config.plugins
			.delete('split-manifest')
			.delete('inline-manifest')
	}
}
*/