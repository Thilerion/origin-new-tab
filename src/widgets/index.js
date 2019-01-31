// WidgetTypes, and imports of all Widgets, Stores, etc
import { Clock, clockConfig } from './Clock';
import { Quote, quoteConfig } from './Quote';
import { News, newsConfig } from './News';
import { TopPages, topPagesConfig } from './TopPages';
import { Weather, weatherConfig } from './Weather';

const components = {
	Clock,
	Quote,
	News,
	TopPages,
	Weather,
}

const configs = {
	clock: clockConfig,
	quote: quoteConfig,
	news: newsConfig,
	topPages: topPagesConfig,
	weather: weatherConfig
}

console.log(configs);

export { components };