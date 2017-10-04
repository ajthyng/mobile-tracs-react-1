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

import * as types from '../../src/constants/actions';
import * as RegistrarActions from '../../src/actions/registrar';
import * as registrarReducer from '../../src/reducers/registrar';
import * as loginReducer from '../../src/reducers/login';
import * as urls from '../../config/urls';

const registrar = types.registrarActions;
const auth = types.authActions;
const registrarInitialState = registrarReducer.initialState;
const loginInitialState = loginReducer.initialState;

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

it('should fail registration with empty netid', async () => {
	const localNetID = '';
	const store = mockStore({
		register: registrarInitialState
	});
	let tokenResponse = mockResponse(401, 'this would be a webpage',
		`<html></html>`);

	global.fetch = jest.fn().mockImplementation(() => Promise.resolve(tokenResponse));

	const expectedActions = [
		{type: registrar.IS_REGISTERING, isRegistering: true},
		{type: registrar.IS_REGISTERING, isRegistering: false},
		{type: registrar.REGISTRATION_FAILED, hasFailed: true},
	];

	await store.dispatch(RegistrarActions.register(localNetID, password));
	expect(store.getActions()).toEqual(expectedActions);
});

it('should be marked as guest with invalid ldap credentials', async () => {
	const store = mockStore({
		register: registrarInitialState,
		login: loginInitialState
	});

	const tokenResponse = mockResponse(401, 'this is the unauthorized webpage',
		`<html></html>`);

	const tracsResponse = mockResponse(200, 'this is a tracs session', `{
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

	global.fetch = jest.fn().mockImplementation((url) => {
		if (url.includes(':3000/token.pl')) {
			return Promise.resolve(tokenResponse);
		} else {
			return Promise.resolve(tracsResponse);
		}
	});

	const expectedActions = [
		{type: registrar.IS_REGISTERING, isRegistering: true},
		{type: auth.LOGIN_IS_GUEST, isGuestAccount: true},
		{type: registrar.IS_REGISTERING, isRegistering: false},
		{type: registrar.REGISTRATION_FAILED, hasFailed: true},
		{type: auth.LOGGING_IN, loggingIn: true},
	];
	await store.dispatch(RegistrarActions.register(netid, password));
	expect(store.getActions()).toEqual(expectedActions);
});