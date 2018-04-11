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
import CookieManager from 'react-native-cookies';
import {credentials} from '../utils/storage';
import {Analytics} from '../utils/analytics';
import * as Storage from '../utils/storage';
import {haxios as axios} from '../utils/networking';

const styles = [
	'background: linear-gradient( #db72b6, #c13891)'
	, 'border: 1px solid #3E0E02'
	, 'color: white'
	, 'display: block'
	, 'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)'
	, 'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset'
	, 'line-height: 40px'
	, 'text-align: center'
	, 'font-weight: bold'
].join(';');

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

const loginFailureAction = (errorMessage) => {
	return {
		type: LOGIN_FAILURE,
		errorMessage
	}
};

const loginFailure = (errorMessage) => {
	return async (dispatch) => {
		await CookieManager.clearAll();
		Storage.credentials.reset().then(() => {
			dispatch(loginFailureAction(errorMessage));
		})
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
		//(netid, encodeURIComponent(password))
		const loginUrl = `${global.urls.baseUrl}${global.urls.login}`;
		const sessionUrl = `${global.urls.baseUrl}${global.urls.session}`;
		const loginData = new FormData();
		loginData.append('_username', netid);
		loginData.append('_password', password);
		axios(loginUrl, {
			method: 'post',
			data: loginData,
			headers: {
				"content-type": "multipart/form-data"
			}
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
						debugger;
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