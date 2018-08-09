/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import {Platform} from 'react-native';
import {auth, login, loginHasFailed, loginIsGuestAccount} from './login';
import {token as TokenStore} from '../utils/storage';
import base64 from 'base-64';
import {registrarActions} from '../constants/actions';
import {haxios as axios} from '../utils/networking';

const {
	REQUEST_REGISTRATION,
	REGISTRATION_SUCCESS,
	REGISTRATION_FAILURE,
	REQUEST_UNREGISTER,
	UNREGISTER_SUCCESS,
	UNREGISTER_FAILURE,
	IS_GUEST_ACCOUNT,
	SET_TOKEN,
	CLEAR_REGISTER_ERROR
} = registrarActions;

const requestRegistration = () => {
	return {
		type: REQUEST_REGISTRATION,
		isRegistering: true,
		isRegistered: false
	}
};

const registrationSuccess = (deviceToken, netid) => {
	return {
		type: REGISTRATION_SUCCESS,
		isRegistering: false,
		isRegistered: true,
		deviceToken,
		netid
	}
};

export const registrationFailure = (error, dispatch, netid, password) => {
	let errorMessage = '';
	switch ((error.response || {}).status) {
		case 400:
			errorMessage = 'There was an error logging you in. Please contact support.';
			break;
		case 401:
			dispatch(login(netid, password));
			errorMessage = 'There was an error logging you in. Please try again.';
			break;
		default:
			if (error.message === "Network Error") {
				errorMessage = "Network Error. Please check your internet connection and try again."
			} else {
				errorMessage = error ? error.message : "There was an error logging you in. Please check your NetID and password."
			}
	}
	return {
		type: REGISTRATION_FAILURE,
		isRegistering: false,
		isRegistered: false,
		errorMessage: new Error(errorMessage)
	}
};

export const clearRegisterError = () => {
	return {
		type: CLEAR_REGISTER_ERROR
	}
};

const postRegistration = async (payload, dispatch) => {
	let {
		netid,
		password,
		jwt,
		deviceToken
	} = payload;
	if (!deviceToken) {
		await TokenStore.getDeviceToken().then((token) => {
			deviceToken = token;
		});
	}
	let registration = {
		platform: Platform.OS,
		app_id: 'edu.txstate.mobile.tracs',
		user_id: netid,
		token: deviceToken,
		settings: {
			global_disable: false,
			blacklist: []
		}
	};
	const dispatchUrl = global.urls.dispatchUrl;
	const registrationUrl = `${dispatchUrl}${global.urls.registration(jwt)}`;
	const getRegistrationUrl = `${dispatchUrl}${global.urls.getRegistration(deviceToken)}`;

	const getOptions = {
		method: 'get',
		headers: {'Content-Type': 'application/json'}
	};

	const postOptions = {
		method: 'post',
		headers: {'Content-Type': 'application/json'},
		data: registration
	};

	const deleteOptions = {
		method: 'delete',
		headers: {'Content-Type': 'application/json'}
	};

	const postRegistrationRequest = (url, options, deviceToken, netid, password) => {
		return axios(url, options).then(res => {
			dispatch(registrationSuccess(deviceToken, netid));
			dispatch(login(netid, password));
		}).catch(err => {
			dispatch(registrationFailure(err, dispatch, netid, password));
		});
	};

	return axios(getRegistrationUrl, getOptions).then(res => {
		if (res.data && res.data.hasOwnProperty("token") && res.data.token === deviceToken) { //We found a token
			if (res.data.token === deviceToken && res.data.user_id === netid) { //The server token and netid matches, already registered
				dispatch(registrationSuccess(res.data.token, netid));
				dispatch(login(netid, password));
			} else { //The stored token is stale, delete and reregister
				axios(registrationUrl, deleteOptions).catch(err => console.log(err));
				return postRegistrationRequest(registrationUrl, postOptions, deviceToken, netid, password);
			}
		} else { //No registration was there, we should register
			return postRegistrationRequest(registrationUrl, postOptions, deviceToken, netid, password);
		}
	}).catch(err => {
		if ((err.response || {}).status === 404) {
			return postRegistrationRequest(registrationUrl, postOptions, deviceToken, netid, password);
		} else {
			dispatch(registrationFailure(err, dispatch, netid, password));
		}
	});
};

const requestUnregister = () => {
	return {
		type: REQUEST_UNREGISTER,
	}
};

const unregisterSuccess = () => {
	return {
		type: UNREGISTER_SUCCESS
	}
};

const unregisterFailure = (errorMessage) => {
	return {
		type: UNREGISTER_FAILURE,
		errorMessage
	}
};

export const setGuestAccount = (isGuestAccount = false) => {
	return {
		type: IS_GUEST_ACCOUNT,
		isGuestAccount
	}
};

export const register = (netid = '', password) => {
	return async (dispatch) => {
		dispatch(requestRegistration());
		if (netid.length === 0) {
			dispatch(registrationFailure(new Error("A NetID is required to login to this application"), dispatch, netid, password));
			return;
		}
		netid = netid.toLowerCase().trim();
		const dispatchUrl = global.urls.dispatchUrl;
		let auth64 = `${netid}:${password}`;
		let headers = {
			'Authorization': 'Basic ' + base64.encode(auth64),
		};
		return axios(`${dispatchUrl}${global.urls.jwt}`, {
			method: 'post',
			headers: headers
		}).then(async res => {
			if (res.data) {
				let deviceToken = await TokenStore.getDeviceToken();
				const payload = {
					netid,
					password,
					jwt: res.data,
					deviceToken,
				};
				postRegistration(payload, dispatch).catch(err => {
					dispatch(registrationFailure(err, dispatch, netid, password));
				});
			}
		}).catch(err => {
			dispatch(registrationFailure(err, dispatch, netid, password));
		});
	}
};

export const unregister = (token) => {
	return async (dispatch) => {
		dispatch(requestUnregister());
		if (!token) {
			await TokenStore.getDeviceToken().then(deviceToken => {
				token = deviceToken;
			});
		}
		const dispatchURL = global.urls.dispatchUrl;
		const deleteRegistrationURL = `${dispatchURL}${global.urls.registrationBase}`;
		const form = new FormData();
		form.append('token', token);
		const options = {
			method: 'delete',
			data: form,
			headers: {'Content-Type': 'multipart/form-data'}
		};

		axios(deleteRegistrationURL, options).then(res => {
				dispatch(unregisterSuccess());
		}).catch(err => {
			dispatch(unregisterFailure(err.message));
		})
	};
};

export const setToken = (token) => {
	return {
		type: SET_TOKEN,
		token
	}
};