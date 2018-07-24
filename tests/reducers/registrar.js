/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {initialState, registerReducer} from '../../src/reducers/registrar';
import {registrarActions} from '../../src/constants/actions';

const registrar = registrarActions;
const netid = 'fak103';
const password = 'password123';

let currentState = initialState;

beforeEach(() => {
	currentState = initialState;
});

it.only('should return initial state for unknown actions', () => {
	expect(registerReducer(undefined, {})).toEqual(initialState);
});

it('should not modify state for undefined actions', () => {
	expect(registerReducer(currentState, {})).toEqual(initialState);
});


it("Should handle Request_Registration action", () => {

	const  action = {

		type: registrar.REQUEST_REGISTRATION,

			isRegistering : true,
			isRegistered : false,
			errorMessage:""

	};

	expect(registerReducer(initialState,action)).toEqual({

		...initialState,
		isRegistering : true,
		isRegistered : false,
		errorMessage:""



	});



});



it("Should handle Registration_Success action", () => {

	const  action = {
		type: registrar.REGISTRATION_SUCCESS,

		isRegistering: false,
		isRegistered: true,
		netid: "",
		deviceToken: "",
		errorMessage: ''

	};

	expect(registerReducer(currentState,action)).toEqual({
	...currentState,

		netid: action.netid,
		deviceToken: "",
		errorMessage: ''

	});



});

it("Should handle Registration_Failure action",() => {
	const action = {

		type: registrar.REGISTRATION_FAILURE,
		isGuestAccount: true,
		errorMessage: ""
	};
	expect(registerReducer(initialState,action)).toEqual({

			...initialState,

		isGuestAccount: true


	});

});

it("Should handle Request_Unregister", () =>

	{
		const  action = {
			type: registrar.REQUEST_UNREGISTER,

			isDeleting: true,
			isDeleted: false,
			errorMessage:""

	};

		expect(registerReducer(initialState,action)).toEqual({

			...initialState,
			isDeleting: true,
			isDeleted: false

		});



	});





it("Should handle UNREGISTER_SUCCESS action",()=> {

		const action = {

			type: registrar.UNREGISTER_SUCCESS,

		};
		expect(registerReducer(initialState, action)).toEqual({
			...initialState
		});

	});


it("Should handle Unregister_Failure action",()=>

	{
		const action ={

			type: registrar.UNREGISTER_FAILURE,
			isDeleting: false,
			isRegistered: true,
			errorMessage:""


		};

		expect(registerReducer(initialState,action)).toEqual(

			{
				...initialState,
				isDeleting: false,
				isRegistered: true


			});

	});


it("Should handle SET_Token Action", ()=>
	{
		const action =
			{
				type:registrar.SET_TOKEN,
				deviceToken:""

			};

		expect(registerReducer(currentState,action)).toEqual({

			...currentState,
			deviceToken:""

		});
	});























































/// old test cases start here



it('should handle IS_REGISTERED action', () => {
	const action = {
		type: registrar.IS_REGISTERED,
		isRegistered: true
	};

	expect(registerReducer(currentState, action)).toEqual({
		...currentState,
		isRegistered: true
	});
});

it('should handle IS_REGISTERING action', () => {
	const action = {
		type: registrar.IS_REGISTERING,
		isRegistering: true
	};

	expect(registerReducer(currentState, action)).toEqual({
		...currentState,
		isRegistering: true
	});
});

it('should handle REMOVE_TOKEN action', () => {
	const action = {
		type: registrar.REMOVE_TOKEN
	};

	expect(registerReducer(currentState, action)).toEqual({
		...currentState,
		deviceToken: ''
	});
});

it('should handle REMOVE_USER action', () => {
	const action = {
		type: registrar.REMOVE_USER
	};

	expect(registerReducer(currentState, action)).toEqual({
		...currentState,
		registeredUser: ''
	});
});

it('should handle REPLACE_TOKEN action', () => {
	const deviceToken = '741290076e3a4e343683052f4b407c9fd299a76a1bbc64911dbea84646a3ea68';
	const action = {
		type: registrar.REPLACE_TOKEN,
		deviceToken
	};

	currentState.deviceToken = 'this is not a real device token';

	expect(registerReducer(currentState, action)).toEqual({
		...currentState,
		deviceToken
	});
});

it('should handle REPLACE_USER action', () => {
	const registeredUser = 'drwiley3';
	const action = {
		type: registrar.REPLACE_USER,
		registeredUser
	};

	currentState.netid = 'robotnik4';

	expect(registerReducer(currentState, action)).toEqual({
		...currentState,
		registeredUser
	});
});

it('should handle REGISTRATION_FAILED action', () => {
	const action = {
		type: registrar.REGISTRATION_FAILED,
		hasFailed: true
	};

	expect(registerReducer(currentState, action)).toEqual({
		...currentState,
		hasFailed: true
	})
});
