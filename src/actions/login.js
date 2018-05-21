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
import CookieManager from 'react-native-cookies';
import {credentials} from '../utils/storage';
import {Analytics} from '../utils/analytics';
import {haxios as axios} from '../utils/networking';
import Toast from '@remobile/react-native-toast';

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

const loginSuccess = (netid, password, tracsID) => {
	Analytics().setUserId(tracsID);
	return {
		type: LOGIN_SUCCESS,
		netid,
		password,
		tracsID
	}
};

const loginFailureAction = (error) => {
	let errorMessage = '';
	switch ((error.response || {}).status) {
		case 404:
			errorMessage = 'Could not connect to TRACS, please contact support.';
			break;
		default:
			if (error.hasOwnProperty('message')) {
				errorMessage = error.message;
			}
			switch (errorMessage) {
				case 'Network Error':
					errorMessage = 'Network Error. Please check your internet connection and try again.';
					break;
				default:
					errorMessage = 'There was a problem logging you in. Please try again later.';
			}
	}
	return {
		type: LOGIN_FAILURE,
		errorMessage: new Error(errorMessage)
	}
};

const loginFailure = (errorMessage) => {
	return async (dispatch) => {
		await CookieManager.clearAll();
		dispatch(loginFailureAction(errorMessage));
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
		dispatch(requestLogin());
		if (netid.length === 0) {
			credentials.get().then(credentials => {
				if (!credentials) {
					dispatch(loginFailure(new Error("Net ID must be filled out")));
				} else {
					netid = credentials.username;
					password = credentials.password;
					dispatch(login(netid, password));
				}
			}).catch(err => {
				console.log("Storage Error: ", err.message);
				dispatch(loginFailure(new Error("Could not retrieve stored credentials")));
			});
			return;
		}

		const loginUrl = `${global.urls.baseUrl}/portal/relogin?eid=${netid}&pw=${encodeURIComponent(password)}`;
		const sessionUrl = `${global.urls.baseUrl}${global.urls.session}`;

		axios(loginUrl, {
			method: 'post',
		}).then(async res => {
			let creds = {
				netid,
				password
			};
			axios(sessionUrl, {method: 'get'}).then(async res => {
				let session = res.headers['content-type'].indexOf('application/json') > -1 ? res.data : null;
				if (session === null) {
					dispatch(loginFailure(new Error("TRACS is down right now. Please try again later.")));
				} else if (session === undefined) {
					dispatch(loginFailure(new Error("There was a problem logging you into TRACS. Please try again later.")));
				} else {
					if (session.userEid === creds.netid) {
						credentials.store(creds.netid, creds.password).then(() => {
							dispatch(loginSuccess(session.userEid, creds.password, session.userId));
						});
					} else {
						if (session.userEid === null) {
							dispatch(loginFailure(new Error("Net ID or password is incorrect.")));
						} else {
							dispatch(loginFailure(new Error("There was a problem logging you into TRACS. Please try again later.")));
						}
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
		return axios(logoutUrl, {
			method: 'get'
		}).then(res => {
				CookieManager.clearAll().then(result => {
					dispatch(logoutSuccess());
				}).catch(err => {
					dispatch(logoutFailure(err))
				});
		}).catch(err => {
			dispatch(logoutFailure(new Error("Could not log out of TRACS.")));
		});
	};
}