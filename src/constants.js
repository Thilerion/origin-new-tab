export const GRID_COLS = 40;
export const GRID_ROWS = 20;

export const API_URL = process.env.NODE_ENV === 'development'
	? "http://localhost:3000"
	: "https://startpage-extension.herokuapp.com";