import axios from 'axios';

const API_URL =
	process.env.NODE_ENV === 'development'
	? "http://localhost:3000"
	: "https://startpage-extension.herokuapp.com";

const baseRequest = axios.create({
	baseURL: API_URL,
	timeout: 20000,
	method: 'get'
})


export { baseRequest };