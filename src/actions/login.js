/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {setGuestAccount, user} from './registrar';
import {authActions} from '../constants/actions';
import {credentials} from '../utils/storage';
import axios from 'axios';

const {
	REQUEST_LOGIN,
	LOGIN_SUCCESS,
	LOGIN_FAILURE,
	REQUEST_LOGOUT,
	LOGOUT_SUCCESS,
	LOGOUT_FAILURE,
	SET_CREDENTIALS,
	CLEAR_ERROR
} = authActions;

const requestLogin = () => {
	return {
		type: REQUEST_LOGIN,
	}
};

const loginSuccess = (netid, password) => {
	return {
		type: LOGIN_SUCCESS,
		netid,
		password,
	}
};

const loginFailure = (errorMessage) => {
	return {
		type: LOGIN_FAILURE,
		errorMessage
	}
};

const requestLogout = () => {
	return {
		type: REQUEST_LOGOUT
	}
};

const logoutSuccess = () => {
	return {
		type: LOGOUT_SUCCESS
	}
};

const logoutFailure = (errorMessage) => {
	return {
		type: LOGOUT_FAILURE,
		errorMessage
	}
};

export const setCredentials = (creds) => {
	return {
		type: SET_CREDENTIALS,
		creds
	}
};

export const clearError = () => {
	return {
		type: CLEAR_ERROR,
	}
};

export function login(netid = '', password) {
	return async (dispatch) => {
		if (netid.length === 0) {
			dispatch(requestLogin());
			credentials.get().then(credentials => {
				if (!credentials) {
					dispatch(loginFailure("Net ID must be filled out"));
				} else {
					netid = credentials.username;
					password = credentials.password;
					dispatch(login(netid, password));
				}
			}).catch(err => {
				console.log("Storage Error: ", err.message);
				dispatch(loginFailure("Could not retrieve stored credentials"));
			});
			return;
		}

		dispatch(requestLogin());

		const loginUrl = `${global.urls.baseUrl}${global.urls.login(netid, encodeURI(password))}`;
		const sessionUrl = `${global.urls.baseUrl}${global.urls.session}`;

		return axios(loginUrl, {method: 'post'}).then(res => {
			let creds = {
				netid,
				password
			};
			return axios(sessionUrl, {method: 'get'}).then(res => {
				let session = res.data;
				console.log(session);
				if (session.userEid === creds.netid) {
					credentials.store(creds.netid, creds.password).then(() => {
						dispatch(loginSuccess(session.userEid, creds.password));
					});
				} else {
					//This error is thrown when the user's creds don't match the session creds. This will happen
					//on a failed login, or an expired session.
					if (session.userEid === null) {
						throw new Error("NetID or password is incorrect");
					} else {
						throw new Error("There was a problem logging into TRACS");
					}

				}
			}).catch(err => {
				dispatch(loginFailure(err));
			});
		}).catch(err => {
			dispatch(loginFailure(err));
		});
	};
}

export function logout() {
	return (dispatch) => {
		dispatch(requestLogout());
		const logoutUrl = `${global.urls.baseUrl}${global.urls.logout}`;
		console.log(logoutUrl);
		return fetch(logoutUrl, {
			method: 'get'
		}).then(res => {
			if (res.ok) {
				dispatch(logoutSuccess());
			} else {
				throw new Error("Could not logout of TRACS");
			}
		}).catch(err => {
			dispatch(logoutFailure(err.message));
		});
	};
}