import {initialState, registerReducer} from '../../src/reducers/registrar'
import {registrarActions} from '../../src/constants/actions'

const registrar = registrarActions
const netid = 'fak103'
const password = 'password123'

let currentState = initialState

beforeEach(() => {
	currentState = initialState
})

it('should return initial state for unknown actions', () => {
	expect(registerReducer(undefined, {})).toEqual(initialState)
})

it('should not modify state for undefined actions', () => {
	expect(registerReducer(currentState, {})).toEqual(initialState)
})

it("Should handle Request_Registration action", () => {
	const  action = {
    type: registrar.REQUEST_REGISTRATION,
    isRegistering : true,
    isRegistered : false,
    errorMessage:""
	}

	expect(registerReducer(initialState,action)).toEqual({
		...initialState,
		isRegistering : true,
		isRegistered : false,
		errorMessage:""
	})
})

it("Should handle REGISTRATION_SUCCESS action", () => {
	const action = {
		type: registrar.REGISTRATION_SUCCESS,
		netid: "fak103",
		deviceToken: "8j9ar0ehv",
  }
  
  const expectedState = {
    ...currentState,
    isRegistered: true,
    isRegistering: false,
    netid: action.netid,
    deviceToken: action.deviceToken
  }

	expect(registerReducer(currentState, action)).toMatchObject(expectedState)
})

it("Should handle Registration_Failure action",() => {
	const action = {
		type: registrar.REGISTRATION_FAILURE,
    isGuestAccount: true,
    errorMessage: 'This failed'
  }
  
	expect(registerReducer(initialState,action)).toEqual({
    ...initialState,
    isGuestAccount: true,
    errorMessage: action.errorMessage
	})
})

it("Should handle Request_Unregister", () => {
  const  action = {
    type: registrar.REQUEST_UNREGISTER,
    isDeleting: true,
    isDeleted: false,
    errorMessage:""
	}
    
  expect(registerReducer(initialState,action)).toEqual({
    ...initialState,
    isDeleting: true,
    isDeleted: false
  })
})

it("Should handle UNREGISTER_SUCCESS action",()=> {
  const action = {
    type: registrar.UNREGISTER_SUCCESS,
  }
  
  expect(registerReducer(initialState, action)).toEqual({
    ...initialState
  })
})

it("Should handle Unregister_Failure action",() => {
  const action = {
    type: registrar.UNREGISTER_FAILURE,
    isDeleting: false,
    isRegistered: true,
    errorMessage:""
  }

  expect(registerReducer(initialState,action)).toEqual({
    ...initialState,
    isDeleting: false,
    isRegistered: true
  })
})

it("Should handle SET_Token Action", () => {
  const action = {
    type:registrar.SET_TOKEN,
    token: ""
  }

  expect(registerReducer(currentState, action)).toEqual({
    ...currentState,
    deviceToken:""
  })
})
  