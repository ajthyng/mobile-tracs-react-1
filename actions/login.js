/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import base64 from 'base-64';

//Indicates a problem logging into auth system
export const LOGIN_HAS_FAILED = 'LOGIN_HAS_FAILED';

function loginHasFailed(bool) {
	return {
		type: LOGIN_HAS_FAILED,
		hasFailed: bool
	};
}

//Indicates the user is a guest account and won't have notifications
export const LOGIN_IS_GUEST = 'LOGIN_IS_GUEST';

export function loginIsGuestAccount(bool) {
	return {
		type: LOGIN_IS_GUEST,
		isGuestAccount: bool
	};
}

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

function auth(netid, password) {
	let loggedIn = netid.length > 0 && password.length > 0;
	let type = loggedIn ? LOGIN : LOGOUT;
	return {
		type: type,
		netid: netid,
		password: password,
		isLoggedIn: loggedIn
	};
}

export const LOGGING_IN = 'LOGGING_IN';

function loggingIn(bool) {
	return {
		type: LOGGING_IN,
		loggingIn: bool,
	}
}

export function logout() {
	login('','');
}

export function login(netid, password) {
	return (dispatch) => {
		dispatch(auth('', ''));
		dispatch(loggingIn(true));

		if (netid.length <= 0) {
			dispatch(loggingIn(false));
			return;
		}
		const baseUrl = 'https://staging.tracs.txstate.edu/';

		fetch(`${baseUrl}portal/relogin?eid=${netid}&pw=${password}`, {
			method: "post"
		})
			.then((res) => {
				if (res.ok) {
					fetch(`${baseUrl}/direct/session/current.json`, {
						method: 'get'
					}).then((res) => {
						res.text().then((text) => {
							let session = JSON.parse(text);
							console.log(session);
							if (session.userEid === netid) {
								dispatch(auth(netid, password));
								dispatch(loginHasFailed(false));
							} else {
								dispatch(auth('', ''));
								dispatch(loginHasFailed(true));
							}
						});
					});
				} else {
					console.log("Login failed with response");
					throw new Error("There was a problem logging in");
				}
			})
			.catch((error) => {
				console.log(error);
				dispatch(loginHasFailed(true));
			});
	};
}