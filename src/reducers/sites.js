/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import * as sites from '../constants/actions';
const {GET_MEMBERSHIPS, IS_FETCHING_SITES, CLEAR_SITES, GET_SITES_FAILED} = sites.sitesActions;
export const initialState = {
	userSites: {},
	isFetchingSites: false,
	hasFailed: false
};

let getMemberships = (state, action) => {
	let userSites = action.userSites;
	let hasSites = Object.keys(userSites).length > 0;
	return {
		...state,
		userSites: action.userSites,
		hasSites
	}
};

let clearSites = (state, action) => {
	return {
		...state,
		userSites: action.userSites
	}
};

let hasFailed = (state, action) => {
	return {
		...state,
		hasFailed: action.hasFailed
	}
};

let isFetchingSites = (state, action) => {
	return {
		...state,
		isFetchingSites: action.isFetchingSites
	}
};

export function sitesReducer(state = initialState, action) {
	switch (action.type) {
		case GET_MEMBERSHIPS: return getMemberships(state, action);
		case IS_FETCHING_SITES: return isFetchingSites(state, action);
		case CLEAR_SITES: return clearSites(state, action);
		case GET_SITES_FAILED: return hasFailed(state, action);
		default: return state;
	}
}