export const GRID_COLS = 40;
export const GRID_ROWS = 20;

export const API_URL = process.env.NODE_ENV === 'development'
	? "http://localhost:3000/"
	: "https://startpage-extension.herokuapp.com";

export const WIDGET_TYPE_BG = 'wallpaper-widget';
export const WIDGET_TYPE_GRID = 'grid-widget';

export const LANGUAGES = ['en', 'nl'];

export const TIME_FORMATS = [
	'HH:mm',
	'HH mm',
	'H:m',
	'H m',
	'hh:mm a',
	'hh mm a',
	'h:m a',
	'h m a'
];

export const ALIGN = {
	start: 'align_start',
	end: 'align_end',
	center: 'align_center',
}