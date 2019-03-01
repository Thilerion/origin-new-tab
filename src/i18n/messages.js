import _merge from 'lodash.merge';
import { localeMessages } from '@/widgets';

const baseMessages = {
	en: {
		settings: {
			username: 'Username',
			language: 'Language',
			timeFormat: 'Time format',
			timeFormat24: '24-hour',
			timeFormat12: '12-hour',
			configureLayout: 'Configure dashboard layout',
			choosePreset: 'Choose preset layout',
			presets: {
				standard: 'Standard'
			},
			help: 'Help',
			whatsNew: "What's new",
			about: 'About'
		},
		settingCategory: {
			general: 'General',
			dashboard: 'Dashboard'
		},
		widgetName: {
			Weather: 'Weather',
			Quote: 'Quote',
			Clock: 'Clock',
			QuickLinks: 'Quick Links',
			WallpaperDetails: 'Wallpaper Details',
			News: 'News'
		},
		configureDashboard: 'Configure Dashboard',
		currentWidgets: 'Current widgets',
		addWidget: 'Add widget',
		addWidgetInfo: 'Click and drag to dashboard to add widget.'
	},
	nl: {
		settings: {
			username: 'Naam',
			language: 'Taal',
			timeFormat: 'Tijdnotatie',
			timeFormat24: '24-uurs',
			timeFormat12: '12-uurs',
			configureLayout: 'Dashboard layout aanpassen',
			choosePreset: 'Kies voorinstelling',
			presets: {
				standard: 'Standaard'
			},
			help: 'Hulp',
			whatsNew: "Nieuwe functies",
			about: 'Over'
		},
		settingCategory: {
			general: 'Algemeen',
			dashboard: 'Dashboard'
		},
		widgetName: {
			Weather: 'Weer',
			Quote: 'Citaat',
			Clock: 'Klok',
			QuickLinks: 'Snelkoppelingen',
			WallpaperDetails: 'Achtergrond Details',
			News: 'Nieuws'
		},
		configureDashboard: 'Dashboard aanpassen',
		currentWidgets: 'Huidige widgets',
		addWidget: 'Widget toevoegen',
		addWidgetInfo: 'Klik en sleep naar het dashboard om een widget toe te voegen.'
	}
};

const messages = _merge(baseMessages, localeMessages);
export default messages;