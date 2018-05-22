/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import configureMockStore from '../mocks/store';
import thunk from 'redux-thunk';
import {Response} from 'whatwg-fetch';

import * as LoginActions from '../../src/actions/login';
import initialState from '../../src/reducers/login';
import {authActions} from '../../src/constants/actions';
import {credentials} from '../../src/utils/storage';
import * as urls from '../../config/urls';

let {LOGIN, LOGOUT, LOGIN_HAS_FAILED, LOGIN_IS_GUEST, LOGGING_IN, IS_LOGGED_IN} = authActions;

const netid = "fak103";
const password = "password123";

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

global.urls = urls.debug;

const mockResponse = (status, statusText, response) => {
	return new Response(response, {
		status,
		statusText,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};

it.only('should create a login action', () => {
	const expectedAction = {
		type: LOGIN,
		netid,
		password,
		isLoggedIn: true
	};

	expect(LoginActions.netidLogin(netid, password)).toEqual(expectedAction);
});

it('should create a logout action', () => {
	const expectedAction = {
		type: LOGOUT,
		netid: '',
		password: '',
		isLoggedIn: false
	};

	expect(LoginActions.netidLogout()).toEqual(expectedAction);
});

it('should mark guest account', () => {
	const isGuestAccount = true;
	const expectedAction = {
		type: LOGIN_IS_GUEST,
		isGuestAccount
	};

	expect(LoginActions.loginIsGuestAccount(isGuestAccount)).toEqual(expectedAction);
});

it('should mark login as failed', () => {
	const hasFailed = true;
	const expectedAction = {
		type: LOGIN_HAS_FAILED,
		hasFailed
	};
	expect(LoginActions.loginHasFailed(hasFailed)).toEqual(expectedAction);
});


it('should fail login without netid', () => {
	const netid = '';
	const store = mockStore({
		login: {
			loggingIn: false,
			isLoggedIn: false
		}
	});

	const expectedActions = [
		{type: LOGGING_IN, loggingIn: true},
		{type: LOGGING_IN, loggingIn: false},
		{type: LOGIN_HAS_FAILED, hasFailed: true}
	];

	store.dispatch(LoginActions.auth(netid, password));
	expect(store.getActions()).toEqual(expectedActions);
});

it('should fail logging in on unauthorized response', async () => {
	global.fetch = jest.fn().mockImplementation(() =>
		Promise.resolve(mockResponse(401, 'Failed login attempt', ''))
	);

	const store = mockStore({
		login: initialState
	});

	const expectedActions = [
		{type: LOGGING_IN, loggingIn: true},
		{type: LOGOUT, netid: '', password: '', isLoggedIn: false},
		{type: LOGIN_HAS_FAILED, hasFailed: true},
	];

	await store.dispatch(LoginActions.auth(netid, password));
	expect(store.getActions()).toEqual(expectedActions);
});

it('should fail logging in without password', async () => {
	let loginResponse = mockResponse(200, 'this would be a webpage', `
		<html><head></head><body></body></html>	
	`);
	let userCompare = mockResponse(200, 'this would be a json object', `{
		"attributeNames": {},
		"attributes": null,
		"creationTime": 1505771455492,
		"currentTime": 1505825298973,
		"id": null,
		"lastAccessedTime": 1505825298972,
		"maxInactiveInterval": 7200,
		"userEid": null,
		"userId": null,
		"active": true,
		"entityReference": "/session",
		"entityURL": "https://staging.tracs.txstate.edu:443/direct/session",
		"entityTitle": "current"
	}`);

	global.fetch = jest.fn().mockImplementation((url) => {
		if (url.includes('/direct/session/current.json')) {
			return Promise.resolve(userCompare);
		} else {
			return Promise.resolve(loginResponse);
		}
	});

	const store = mockStore({
		login: initialState
	});

	const expectedActions = [
		{type: LOGGING_IN, loggingIn: true},
		{type: LOGOUT, netid: '', password: '', isLoggedIn: false},
		{type: LOGIN_HAS_FAILED, hasFailed: true}
	];

	await store.dispatch(LoginActions.auth(netid, ''));
	expect(store.getActions()).toEqual(expectedActions);
});

it('should login successfully with netid and password', async () => {
	let loginResponse = mockResponse(200, 'this would be a webpage', `
		<html><head></head><body></body></html>	
	`);

	let userCompare = mockResponse(200, 'this would be a json object', `{
		"attributeNames": {},
		"attributes": null,
		"creationTime": 1505771455492,
		"currentTime": 1505825298973,
		"id": null,
		"lastAccessedTime": 1505825298972,
		"maxInactiveInterval": 7200,
		"userEid": "${netid}",
		"userId": null,
		"active": true,
		"entityReference": "/session",
		"entityURL": "https://staging.tracs.txstate.edu:443/direct/session",
		"entityTitle": "current"
	}`);

	global.fetch = jest.fn().mockImplementation(url => {
		if (url.includes('/direct/session/current.json')) {
			return Promise.resolve(userCompare);
		} else {
			return Promise.resolve(loginResponse);
		}
	});

	credentials.store = jest.fn().mockImplementation((netid, password) => {
		return Promise.resolve();
	});

	const store = mockStore({
		login: initialState
	});

	const expectedActions = [
		{type: LOGGING_IN, loggingIn: true},
		{type: LOGGING_IN, loggingIn: false},
		{type: LOGIN_HAS_FAILED, hasFailed: false},
		{type: LOGIN, netid, password, isLoggedIn: true}
	];

	await store.dispatch(LoginActions.auth(netid, password));
	expect(store.getActions()).toEqual(expectedActions);
});