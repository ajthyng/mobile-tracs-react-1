import createMockStore from '../mocks/store'
import thunk from 'redux-thunk'

import {registrarActions as actions, authActions as login} from '../../src/constants/actions'
import {register} from '../../src/actions/registrar'
import { token as TokenStore } from '../../src/utils/storage'
import {initialState} from '../../src/reducers/registrar'
import {initialState as loginInitialState} from '../../src/reducers/login'
import {credentials} from '../../src/utils/storage'
import firebase from 'react-native-firebase'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import * as Networking from '../../src/utils/networking'

const urls = require('../../config/urls')

const netid = 'fak103'
const password = 'password123'

const middleware = [thunk]
const mockStore = createMockStore(middleware)
const axiosMock = new MockAdapter(axios)
let store = null

describe('registrar tests', () => {
  beforeEach(() => {
    store = mockStore({})
    Networking.haxios = axios
    axiosMock.reset()
    global.urls = urls
  })

  it('should fail registration with empty netid', async () => {
    const store = mockStore({
      register: initialState
    })

    const expectedActions = [
      {
        type: actions.REQUEST_REGISTRATION, 
        isRegistering: true, 
        isRegistered: false
      },
      {
        type: actions.REGISTRATION_FAILURE, 
        isRegistering: false, 
        isRegistered: false,
        errorMessage: new Error('A NetID is required to login to this application')
      }
    ]

    await store.dispatch(register('', password))
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should fail registration with incorrect netid/password', async () => {
    const store = mockStore({
      register: initialState
    })

    const expectedActions = [
      {
        type: actions.REQUEST_REGISTRATION, 
        isRegistering: true, 
        isRegistered: false
      },
      {
        type: actions.REGISTRATION_FAILURE,
        isRegistered: false,
        isRegistering: false,
        errorMessage: new Error('There was an error logging you in. Please contact support.')
      }
    ]

    const jwtUrl = `${global.urls.dispatchUrl}${global.urls.jwt}`
    axiosMock.onPost(jwtUrl).reply(400)

    await store.dispatch(register(netid, password))
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should fail registration for 401 errors', () => {
    const store = mockStore({
      register: initialState,
    })

    const expectedActions = [
      {
        type: actions.REQUEST_REGISTRATION, 
        isRegistering: true, 
        isRegistered: false
      },
      {
        type: login.REQUEST_LOGIN,
        silentLogin: false,
      },
      {
        type: actions.REGISTRATION_FAILURE,
        isRegistered: false,
        isRegistering: false,
        errorMessage: new Error('There was an error logging you in. Please try again.')
      }
    ]

    credentials.store = jest.fn(() => Promise.resolve({username: netid, password}))

    const jwtUrl = `${global.urls.dispatchUrl}${global.urls.jwt}`
    const sessionUrl = `${global.urls.baseUrl}${global.urls.session}`

    axiosMock
      .onPost(jwtUrl).reply(401)
      .onGet(sessionUrl).replyOnce(200, {
        "attributeNames": {
        },
        "attributes": null,
        "creationTime": 1537454133969,
        "currentTime": 1537454133970,
        "id": null,
        "lastAccessedTime": 1537454133969,
        "maxInactiveInterval": 1800,
        "userEid": null,
        "userId": null,
        "active": true,
        "entityReference": "\/session",
        "entityURL": "https:\/\/staging.tracs.txstate.edu:443\/direct\/session",
        "entityTitle": "current"
      })

    return store.dispatch(register(netid, password)).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('should fail registration with network error', () => {
    const store = mockStore({
      register: initialState
    })

    const expectedActions = [
      {
        type: actions.REQUEST_REGISTRATION, 
        isRegistering: true, 
        isRegistered: false
      },
      {
        type: actions.REGISTRATION_FAILURE,
        isRegistered: false,
        isRegistering: false,
        errorMessage: new Error('Network Error. Please check your internet connection and try again.')
      }
    ]

    axiosMock.onAny().networkError()

    return store.dispatch(register(netid, password)).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('should register and login with proper netid and password', () => {
    const store = mockStore({
      register: initialState
    })
    const token = 'afafafafafaf'

    const expectedActions = [
      {
        type: actions.REQUEST_REGISTRATION, 
        isRegistering: true, 
        isRegistered: false
      },
      {
        type: actions.REGISTRATION_SUCCESS,
        isRegistered: true,
        isRegistering: false,
        deviceToken: token,
        netid
      }
    ]


    TokenStore.getDeviceToken = jest.fn(() => Promise.resolve(token))
    const getRegistrationUrl = `${global.urls.dispatchUrl}${global.urls.getRegistration(token)}`
    const jwtUrl = `${global.urls.dispatchUrl}${global.urls.jwt}`

    axiosMock.onPost(jwtUrl).reply(200, 'ey2jtre.rejiownfaowe')
    axiosMock.onGet(getRegistrationUrl).reply(200, {token, user_id: netid})

    const loginUrl = `${global.urls.baseUrl}/portal/relogin?eid=${netid}&pw=${encodeURIComponent(password)}`
    axiosMock.onPost(loginUrl).reply(200, {})

    const sessionUrl = `${global.urls.baseUrl}${global.urls.session}`
    axiosMock.onGet(sessionUrl).reply(200, null, {'content-type': 'application/json'})



    return store.dispatch(register(netid, password)).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})

