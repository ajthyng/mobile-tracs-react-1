/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {initialState, sitesReducer} from '../../src/reducers/sites';
import {sitesActions} from '../../src/constants/actions';

const sites = sitesActions;

let currentState = initialState;

beforeEach(() => {
	currentState = initialState;
});

it('should return initial state for unknown actions', () => {
	expect(sitesReducer(undefined, {})).toEqual(initialState);
});

it('should handle GET_MEMBERSHIPS action', () => {
	const userSites = {
		"518g910h19": {
			name: "sitename",
			id: "518g910h19",
			tools: {
				"sakai.announcements": "crazyidhere"
			}
		},
		"518g9ga410h19": {
			name: "anti-sitename",
			id: "518g9ga410h19",
			tools: {
				"sakai.announcements": "evenmorecrazyidhere"
			}
		}
	};
	const action = {
		type: sites.GET_MEMBERSHIPS,
		userSites: userSites
	};

	expect(sitesReducer(currentState, action)).toEqual({
		...currentState,
		userSites: userSites
	});
});
