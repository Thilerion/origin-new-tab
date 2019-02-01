export const GRID_COLS = 40;
export const GRID_ROWS = 20;

export const API_URL = process.env.NODE_ENV === 'development'
	? "http://localhost:3000"
	: "https://startpage-extension.herokuapp.com";

export const WIDGET_TYPE_BG = 'wallpaper-widget';
export const WIDGET_TYPE_GRID = 'grid-widget';