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
import {auth, loginIsGuestAccount} from './login';
import base64 from 'base-64';
import {token} from '../utils/storage';

export const IS_REGISTERED = 'IS_REGISTERED';
let isRegistered = (bool) => {
	return {
		type: IS_REGISTERED,
		isRegistered: bool,
	}
};

export const REMOVE_TOKEN = 'REMOVE_TOKEN';
export const REPLACE_TOKEN = 'REPLACE_TOKEN';
let updateToken = (token) => {
	let type = (typeof token === 'undefined' || token.length === 0) ? REMOVE_TOKEN : REPLACE_TOKEN;
	return {
		type: type,
		deviceToken: token
	}
};

export const REMOVE_USER = 'REMOVE_USER';
export const REPLACE_USER = 'REPLACE_USER';
let user = (netid = '') => {
	let type = (typeof netid === 'undefined' || netid.length === 0) ? REMOVE_USER : REPLACE_USER;
	return {
		type: type,
		registeredUser: netid
	}
};

export let register = (netid, password) => {
	return (dispatch) => {
		let baseUrl = 'https://dispatchqa1.its.qual.txstate.edu';

		let auth64 = `${netid}:${password}`;
		let headers = new Headers();
		headers.append('Authorization', 'Basic ' + base64.encode(auth64));
		fetch(`${baseUrl}:3000/token.pl`, {
			method: 'get',
			headers: headers
		}).then((res) => {
			if (res.ok) {
				res.text().then((jwt) => {
					token.get().then(deviceToken => {
						postRegistration(jwt, deviceToken);
					});
				})
			} else {
				throw new Error("Could not retrieve JWT");
			}
		}).catch((error) => {
			console.log("Error: ", error ? error.message : "JWT Service error");
			dispatch(loginIsGuestAccount(true));
			dispatch(auth(netid, password));
		});

		let postRegistration = (jwt, deviceToken) => {
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
			fetch(`${baseUrl}/registrations?jwt=${jwt}`, {
				method: 'post',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(registration)
			}).then((res) => {
				if (res.ok) {
					console.log("Registered with dispatch using token: ", deviceToken);
					console.log("NetID: " + netid);
					dispatch(user(netid));
					dispatch(isRegistered(true));
					dispatch(updateToken(deviceToken));
					dispatch(auth(netid, password));
				} else {
					throw new Error("Could not register device");
				}
			}).catch((error) => {
				console.log("Error: ", error ? error.message : "Registration error");
				dispatch(user());
				dispatch(loginIsGuestAccount(true));
			});
		};
	}
};