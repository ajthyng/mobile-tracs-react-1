/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


import {initialState, loginReducer} from '../../src/reducers/login';
import {authActions} from '../../src/constants/actions';

const auth = authActions;
const netid = 'fak103';
const password = 'password123';

let currentState = initialState;

beforeEach(() => {
	currentState = initialState;
});

it('should return initial state for undefined state', () => {
	expect(loginReducer(undefined, {})).toEqual(currentState);
});

it('should handle REQUEST_LOGIN action', () => {
	const action = {
		type: auth.REQUEST_LOGIN,
		...initialState,
		isAuthenticated: false,
		isLoggingIn: true,
		errorMessage: ""

	};
	expect(loginReducer(initialState, action)).toEqual({
		...initialState,
		isAuthenticated: false,
		isLoggingIn: true,
		errorMessage: ""

	});
});

it('should handle REQUEST_LOGOUT action', () => {
	const action = {
		type: auth.REQUEST_LOGOUT,
		...currentState,
		isLoggingOut: true,
		errorMessage: ""
	};

	currentState.netid = netid;
	currentState.password = password;
	currentState.isLoggedIn = true;

	expect(loginReducer(currentState, action)).toEqual({
		...currentState,
		errorMessage: "",
		isLoggingOut: true,
	});
});



it('should handle LOGIN_FAILURE action', () => {
	const action = {
		type: auth.LOGIN_FAILURE,

		errorMessage : " LOGIN HAS FAILED"

	};

	expect(loginReducer(initialState, action)).toEqual({
		...initialState,

		errorMessage : " LOGIN HAS FAILED"
	});
});


it('Should handle LOGIN_SUCCESS action', () => {

	const action = {

		type: auth.LOGIN_SUCCESS,
		isAuthenticated: true,
		isLoggingIn: false,
		errorMessage: "",
		tracsID: "D_a204",
		netid: "D_a204",
		password: "12345"

	};

	expect(loginReducer(initialState, action)).toEqual({

		...initialState,
		isAuthenticated: true,
		isLoggingIn: false,
		errorMessage: "",
		tracsID: action.tracsID,
		netid: "D_a204",
		password: "12345"


	});


});


it( 'Should handle LOGOUT_FAILURE action', () => {

	const action = {

		type :auth.LOGOUT_FAILURE,
		...initialState,
		errorMessage : "Logout Failure"

	};

	expect (loginReducer(initialState,action)).toEqual({


		...initialState,
		errorMessage : "Logout Failure"

	});

});

it ('Should handle CLEAR_ERROR action', ()=>
{
	const action = {

		type: auth.CLEAR_ERROR,
		...initialState,
		errorMessage : ""

	};

	expect (loginReducer(initialState,action)).toEqual({

		...initialState,
		errorMessage : ""

	});

});
