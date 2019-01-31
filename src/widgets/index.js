// WidgetTypes, and imports of all Widgets, Stores, etc
const components = {
	Clock: () => import(/*webpackChunkName: 'Clock' */'./Clock'),
	Quote: () => import(/*webpackChunkName: 'Quote' */'./Quote'),
	News: () => import(/*webpackChunkName: 'News' */'./News'),
	TopPages: () => import(/*webpackChunkName: 'TopPages' */'./TopPages'),
	Weather: () => import(/*webpackChunkName: 'Weather' */'./Weather'),
}

export { components, modules };