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
import thunk from 'redux-thunk'
import {Response} from 'whatwg-fetch';

import * as SitesActions from '../../src/actions/sites';
import {initialState} from '../../src/reducers/sites';
import * as types from '../../src/constants/actions'
import membershipData from '../responses/sites/memberships.json';

const {GET_MEMBERSHIPS} = types.sitesActions;

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

const mockResponse = (status, statusText, response) => {
	return new Response(response, {
		status,
		statusText,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};

it('should return no sites if cookie is missing/bad', async () => {
	const expectedActions = [
		{type: GET_MEMBERSHIPS, sites: []}
	];

	const store = mockStore({
		sites: initialState
	});

	const badResponse = `<html><head><title>Apache Tomcat/7.0.59 - Error report</title></head><body></body></html>`;

	const noCookieResponse = mockResponse(400, 'not a valid session', badResponse);

	global.fetch = jest.fn().mockImplementation(() => {
		return Promise.resolve(noCookieResponse)
	});

	await store.dispatch(SitesActions.getSiteInfo());
	expect(store.getActions()).toEqual(expectedActions);
});

it.only('should return no sites if memberships is empty', async () => {
	const expectedActions = [
		{type: GET_MEMBERSHIPS, sites: []}
	];

	const store = mockStore({
		sites: initialState
	});

	const emptyMemberships = `{"entityPrefix": "membership", "membership_collection": []}`;

	const noMembershipResponse = mockResponse(200, 'valid session', emptyMemberships);

	global.fetch = jest.fn().mockImplementation(() => {
		return Promise.resolve(noMembershipResponse)
	});

	await store.dispatch(SitesActions.getSiteInfo());
	expect(store.getActions()).toEqual(expectedActions);
});

it('should return an array of sites', () => {

	let membershipResponse = mockResponse(200, 'membership response', JSON.stringify(membershipData));
	console.log(membershipData.entityPrefix);
	let sitesResponse = mockResponse(200, 'sites response', `
	
	`)


});