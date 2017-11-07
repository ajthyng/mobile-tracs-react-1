/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

module.exports = {
	authActions: {
		LOGIN_HAS_FAILED: 'LOGIN_HAS_FAILED',
		LOGIN_IS_GUEST: 'LOGIN_IS_GUEST',
		LOGGING_IN: 'LOGGING_IN',
		IS_LOGGED_IN: 'IS_LOGGED_IN',
		LOGIN: 'LOGIN',
		LOGOUT: 'LOGOUT'
	},
	registrarActions: {
		IS_REGISTERED: 'IS_REGISTERED',
		IS_REGISTERING: 'IS_REGISTERING',
		REGISTRATION_FAILED: 'REGISTRATION_FAILED',
		REMOVE_TOKEN: 'REMOVE_TOKEN',
		REPLACE_TOKEN: 'REPLACE_TOKEN',
		REMOVE_USER: 'REMOVE_USER',
		REPLACE_USER: 'REPLACE_USER'
	},
	sitesActions: {
		GET_MEMBERSHIPS: 'GET_MEMBERSHIPS',
		IS_FETCHING_SITES: 'IS_FETCHING_SITES',
		CLEAR_SITES: 'CLEAR_SITES',
		GET_SITES_FAILED: 'GET_SITES_FAILED'
	},
	routingActions: {
		CURRENT_SCENE: 'CURRENT_SCENE'
	},
	settingsActions: {
		REQUEST_SETTINGS: 'REQUEST_SETTINGS',
		SETTINGS_SUCCESS: 'SETTINGS_SUCCESS',
		SETTINGS_FAILURE: 'SETTINGS_FAILURE',
		REQUEST_SAVE_SETTINGS: 'REQUEST_SAVE_SETTINGS',
		SAVE_SETTINGS_SUCCESS: 'SAVE_SETTINGS_SUCCESS',
		SAVE_SETTINGS_FAILURE: 'SAVE_SETTINGS_FAILURE'
	}
};