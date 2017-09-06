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
export function loginHasFailed(bool) {
	return {
		type: 'LOGIN_HAS_FAILED',
		hasFailed: bool
	};
}

//Indicates the user is a guest account and won't have notifications
export function loginIsGuestAccount(bool) {
	return {
		type: 'LOGIN_IS_GUEST',
		isGuestAccount: bool
	};
}

//Indicates the request to login is still pending
export function isLoggedIn(bool) {
	return {
		type: 'LOGGED_IN',
		isLoggedIn: bool
	};
}

export function login(netid, password) {
	return (dispatch) => {
		dispatch(isLoggedIn(false));

		let auth64 = `${netid}:${password}`;
		auth64 = base64.encode(auth64);

		const login = (netid, password) => {
			fetch(`https://tracs.txstate.edu/portal/relogin?eid=${netid}&pw=${password}`, {
				method: "post"
			})
				.then((res) => {
					if (res.ok) {
						res.text().then((data) => {
							let loggedIn = data.indexOf('"loggedIn": true') >= 0;
							console.log("Logged in successfully");
							dispatch(isLoggedIn(loggedIn));
							//dispatch(loginHasFailed(false));
							//dispatch(loginIsGuestAccount(false));
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
					login(netid, password);
				}
			})
			.catch(() => {
				dispatch(loginIsGuestAccount(true));
				login(netid, password);
			});
	}
}

export function logout() {
	return {
		type: 'LOGOUT'
	};
}