/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {user} from './registrar';
import {authActions} from '../constants/actions';
import {credentials} from '../utils/storage';

const {
	LOGIN,
	LOGOUT,
	LOGIN_HAS_FAILED,
	LOGIN_IS_GUEST,
	LOGGING_IN,
	IS_LOGGED_IN
} = authActions;

export function loginHasFailed(bool) {
	return {
		type: LOGIN_HAS_FAILED,
		hasFailed: bool
	};
}

export function loginIsGuestAccount(bool) {
	return {
		type: LOGIN_IS_GUEST,
		isGuestAccount: bool
	};
}

export function netidLogin(netid, password) {
	return {
		type: LOGIN,
		netid,
		password,
		isLoggedIn: true
	};
}

export function netidLogout() {
	return {
		type: LOGOUT,
		netid: '',
		password: '',
		isLoggedIn: false
	};
}

export function loggingIn(bool) {
	return {
		type: LOGGING_IN,
		loggingIn: bool,
	}
}

export function isLoggedIn(bool) {
	return {
		type: IS_LOGGED_IN,
		isLoggedIn: bool
	}
}

export function auth(netid = '', password) {
	return (dispatch) => {
		dispatch(loggingIn(true));

		if (netid.length === 0) {
			dispatch(loggingIn(false));
			return;
		}
		const loginUrl = `${global.urls.baseUrl}${global.urls.login(netid, password)}`;
		const sessionUrl = `${global.urls.baseUrl}${global.urls.session}`;

		return fetch(loginUrl, {method: 'post'}).then(res => {
				if (res.ok) {
					let creds = {
						netid,
						password
					};
					return fetch(sessionUrl, {method: 'get'})
						.then(res => res.json())
						.then(session => {
							if (session.userEid === creds.netid) {
								credentials.store(creds.netid, creds.password).then(() => {
									dispatch(netidLogin(session.userEid, creds.password));
									dispatch(loggingIn(false));
									dispatch(loginHasFailed(false));
								});
							} else {
								dispatch(netidLogout());
								dispatch(loginHasFailed(true));
							}
						});
				} else {
					dispatch(netidLogout());
					dispatch(loginHasFailed(true));
				}
			});
	};
}

export function logout() {
	return (dispatch) => {
		const logoutUrl = `${global.urls.baseUrl}${global.urls.logout}`;

		fetch(logoutUrl, {
			method: 'get'
		}).then(res => {
			if (res.ok) {
				dispatch(netidLogout());
				dispatch(isLoggedIn(false));
			}
		});
	};
}