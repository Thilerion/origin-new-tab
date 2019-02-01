import axios from 'axios';
import { API_URL } from '@/constants.js';

const ApiLogger = {
	_successBg: '#089108',
	_errorBg: '#a40909',
	_baseStyle(color) {
		return `color: white; background-color: ${color}; line-height: 1.5; font-weight: bold;`;
	},

	success(moduleName, data) {
		console.log(`%cRequest complete from module '${moduleName}, with the following data:\n'`, ApiLogger._baseStyle(ApiLogger._successBg), data);
	},

	error(moduleName, error) {
		console.log(`%cRequest FAILED from module '${moduleName}, with the following error:\n'`, ApiLogger._baseStyle(ApiLogger._errorBg), error);
	}
}

const BaseRequest = axios.create({
	baseURL: API_URL,
	timeout: 20000,
	method: 'get'
});

async function ApiRequest(moduleName, url = '', params = {}) {
	try {
		const response = await BaseRequest({
			url,
			params: {
				...params
			}
		});
		ApiLogger.success(moduleName, response.data);
		return response.data;
	} catch (e) {
		ApiLogger.error(moduleName, e);
		throw e;
	}
}

export { ApiLogger, ApiRequest };