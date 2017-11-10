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
import {auth, loginHasFailed, loginIsGuestAccount} from './login';
import FCM from 'react-native-fcm';
import base64 from 'base-64';
import {token} from '../utils/storage';
import {registrarActions} from '../constants/actions';

const {
	IS_REGISTERED,
	IS_REGISTERING,
	REGISTRATION_FAILED,
	REMOVE_TOKEN,
	REPLACE_TOKEN,
	REMOVE_USER,
	REPLACE_USER,
	REQUEST_REGISTRATION_DELETE,
	REGISTRATION_DELETE_SUCCESS,
	REGISTRATION_DELETE_FAILURE
} = registrarActions;

const isRegistered = (bool) => {
	return {
		type: IS_REGISTERED,
		isRegistered: bool,
	}
};

const registrationHasFailed = (bool) => {
	return {
		type: REGISTRATION_FAILED,
		hasFailed: bool
	}
};

const user = (netid = '') => {
	let type = (typeof netid === 'undefined' || netid.length === 0) ? REMOVE_USER : REPLACE_USER;
	return {
		type: type,
		registeredUser: netid
	}
};

const postRegistration = async (payload) => {
	let {netid, password, jwt, deviceToken, dispatch} = payload;
	if (!deviceToken) {
		await FCM.getFCMToken().then((token) => {
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
		body: JSON.stringify(registration)
	};
	return fetch(getRegistrationUrl, getOptions).then(res => {
		if (res.ok) {
			return res.json();
		}
	})
		.then(res => {
			if (res && res.hasOwnProperty("token") && res.token === deviceToken) {
				console.log("Stored Token: ", deviceToken);
				console.log("Server Token: ", res.token);
				dispatch(user(netid));
				dispatch(isRegistered(true));
				dispatch(isRegistering(false));
				dispatch(auth(netid, password));
			} else {
				return fetch(registrationUrl, postOptions).then(res => {
					if (res.ok) {
						dispatch(user(netid));
						dispatch(isRegistered(true));
						dispatch(updateToken(deviceToken));
					} else {
						console.log("Error: Could not register device");
						dispatch(user());
						dispatch(isRegistered(false));
						dispatch(registrationHasFailed(true));
						dispatch(loginIsGuestAccount(true));
					}
					dispatch(isRegistering(false));
					dispatch(auth(netid, password));
				});
			}
		});
};

const requestRegistrationDelete = () => {
	return {
		type: REQUEST_REGISTRATION_DELETE,
	}
};

const registrationDeleteSuccess = () => {
	return {
		type: REGISTRATION_DELETE_SUCCESS
	}
};

const registrationDeleteFailure = (errorMessage) => {
	console.log(errorMessage);
	return {
		type: REGISTRATION_DELETE_FAILURE,
		errorMessage
	}
};

export const isRegistering = (bool) => {
	return {
		type: IS_REGISTERING,
		isRegistering: bool
	}
};

export const updateToken = (token) => {
	let type = (typeof token === 'undefined' || token.length === 0) ? REMOVE_TOKEN : REPLACE_TOKEN;
	return {
		type: type,
		deviceToken: token
	}
};

export const register = (netid = '', password) => {
	return (dispatch) => {
		dispatch(isRegistering(true));
		if (netid.length === 0) {
			dispatch(isRegistering(false));
			dispatch(registrationHasFailed(true));
			dispatch(loginHasFailed(true));
			return;
		}
		const dispatchUrl = global.urls.dispatchUrl;
		let auth64 = `${netid}:${password}`;
		let headers = {
			'Authorization': 'Basic ' + base64.encode(auth64),
		};
		return fetch(`${dispatchUrl}${global.urls.jwt}`, {
			method: 'get',
			headers: headers
		}).then(res => {
			if (res.ok) {
				return res.text();
			} else {
				dispatch(loginIsGuestAccount(true));
				dispatch(isRegistering(false));
				dispatch(registrationHasFailed(true));
				dispatch(auth(netid, password));
			}
		}).then(jwt => {
			token.get().then(deviceToken => {
				const payload = {
					netid,
					password,
					jwt,
					deviceToken,
					dispatch
				};
				postRegistration(payload);
			});
		}).catch(err => {
			dispatch(loginIsGuestAccount(true));
			dispatch(isRegistering(false));
			dispatch(registrationHasFailed(true));
			dispatch(auth(netid, password));
			console.log(err.message);
		});
	}
};

export const unregister = (token) => {
	return async (dispatch) => {
		dispatch(requestRegistrationDelete());
		if (!token) {
			await FCM.getFCMToken().then(deviceToken => {
				token = deviceToken;
			});
		}
		const dispatchURL = global.urls.dispatchUrl;
		const deleteRegistrationURL = `${dispatchURL}${global.urls.registrationBase}`;
		const form = new FormData();
		form.append('token', token);
		const options = {
			method: 'delete',
			body: form,
			headers: {'Content-Type': 'multipart/form-data'}
		};

		fetch(deleteRegistrationURL, options).then(res => {
			if (res.ok) {
				dispatch(registrationDeleteSuccess());
			} else {
				const errorMessage = "Could not unregister device for push notifications";
				dispatch(registrationDeleteFailure(errorMessage));
			}
		}).catch(err => {
			dispatch(registrationDeleteFailure(err.message));
		})
	};
};