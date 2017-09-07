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
import { credentials } from '../utils/storage'

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
function loginIsGuestAccount(bool) {
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

export function login(netid, password) {
	return (dispatch) => {
		dispatch(auth('',''));
		dispatch(loggingIn(true));
		const baseUrl = 'https://tracs.txstate.edu/';
		let auth64 = `${netid}:${password}`;
		auth64 = base64.encode(auth64);

		const netidLogin = (netid, password) => {
			fetch(`${baseUrl}portal/relogin?eid=${netid}&pw=${password}`, {
				method: "post"
			})
				.then((res) => {
					if (res.ok) {
						res.text().then((data) => {
							let loggedIn = data.indexOf('"loggedIn": true') >= 0;
							if (loggedIn) {
								console.log("Logged in successfully");
								credentials.store(netid, password, baseUrl).then(() => {
									console.log("Stored credentials");
									dispatch(auth(netid, password));
								});
							} else {
								console.log("Logged failed with valid response");
								credentials.reset(baseUrl);
								dispatch(auth('',''));
							}

							dispatch(loginHasFailed(!loggedIn));
							dispatch(loginIsGuestAccount(false));
						});
					} else {
						console.log("Login failed with response");
						throw new Error("There was a problem logging in");
					}
				})
				.catch(() => {
					console.log("Login failed with error");
					dispatch(loginHasFailed(true));
				});
		};
		fetch("https://dispatch.its.txstate.edu:3000/token.pl", {
			method: "get",
			headers: {
				"Authorization": `Basic ${auth64}`
			}
		})
			.then((res) => {
				if (res.ok) {
					console.log("Token retrieved");
					dispatch(loginIsGuestAccount(false));
					netidLogin(netid, password);
				}
			})
			.catch(() => {
				dispatch(loginIsGuestAccount(true));
				netidLogin(netid, password);
			});
	}
}