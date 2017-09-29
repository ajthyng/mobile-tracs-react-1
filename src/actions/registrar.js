/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import {Headers, Platform} from 'react-native';
import {auth, loginIsGuestAccount} from './login';
import base64 from 'base-64';
import {token} from '../utils/storage';
import {registrarActions} from '../constants/actions';

const {IS_REGISTERED, IS_REGISTERING, REGISTRATION_FAILED, REMOVE_TOKEN, REPLACE_TOKEN, REMOVE_USER, REPLACE_USER} = registrarActions;

const isRegistered = (bool) => {
	return {
		type: IS_REGISTERED,
		isRegistered: bool,
	}
};

const isRegistering = (bool) => {
	return {
		type: IS_REGISTERING,
		isRegistering: bool
	}
};

const registrationHasFailed = (bool) => {
	return {
		type: REGISTRATION_FAILED,
		hasFailed: bool
	}
};

const updateToken = (token) => {
	let type = (typeof token === 'undefined' || token.length === 0) ? REMOVE_TOKEN : REPLACE_TOKEN;
	return {
		type: type,
		deviceToken: token
	}
};

const user = (netid = '') => {
	let type = (typeof netid === 'undefined' || netid.length === 0) ? REMOVE_USER : REPLACE_USER;
	return {
		type: type,
		registeredUser: netid
	}
};

const postRegistration = (payload) => {
	const {netid, password, jwt, deviceToken, dispatch } = payload;
	console.log("Token: ", deviceToken);
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
	return fetch(registrationUrl, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(registration)
	}).then(res => {
		if (res.ok) {
			console.log("Registered with dispatch using token: ", deviceToken);
			dispatch(user(netid));
			dispatch(isRegistered(true));
			dispatch(isRegistering(false));
			dispatch(updateToken(deviceToken));
		} else {
			console.log("Error: Could not register device");
			dispatch(user());
			dispatch(loginIsGuestAccount(true));
		}
		dispatch(auth(netid, password));
	});
};

export let register = (netid = '', password) => {
	const dispatchUrl = global.urls.dispatchUrl;
	return (dispatch) => {
		dispatch(isRegistering(true));
		if (netid.length === 0) {
			dispatch(isRegistering(false));
			dispatch(registrationHasFailed(true));
			return;
		}
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
		});
	}
};