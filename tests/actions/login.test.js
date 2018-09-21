import configureMockStore from '../mocks/store'
import thunk from 'redux-thunk'
import {login} from '../../src/actions/login'
import {credentials} from '../../src/utils/storage'
import {authActions as actions} from '../../src/constants/actions'
import * as Networking from '../../src/utils/networking'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const urls = require('../../config/urls')
const middleware = [thunk]
const mockStore = configureMockStore(middleware)
const noSessionResponse = {
  "attributeNames": {},
  "attributes": null,
  "creationTime": 1532445477201,
  "currentTime": 1532452039266,
  "id": null,
  "lastAccessedTime": 1532452039265,
  "maxInactiveInterval": 1800,
  "userEid": null,
  "userId": null,
  "active": true,
  "entityReference": "\/session",
  "entityURL": "http:\/\/localhost:8080\/direct\/session",
  "entityTitle": "current"
}

const validSessionResponse = (netid, tracsID) => ({
  "attributeNames": {},
  "attributes": null,
  "creationTime": 1532445477201,
  "currentTime": 1532452039266,
  "id": null,
  "lastAccessedTime": 1532452039265,
  "maxInactiveInterval": 1800,
  "userEid": netid,
  "userId": tracsID,
  "active": true,
  "entityReference": "\/session",
  "entityURL": "http:\/\/localhost:8080\/direct\/session",
  "entityTitle": "current"
})

let store = null
let axiosMock = new MockAdapter(axios)

beforeEach(() => {
  store = mockStore({})
  Networking.haxios = axios
  axiosMock.reset()
  axiosMock.resetHandlers()
  global.urls = urls
})

it('should fail if netid is not provided', () => {
  credentials.get = jest.fn().mockImplementation(() => Promise.resolve(false))

  const expectedActions = [
    {type: actions.REQUEST_LOGIN, silentLogin: false},
    {type: actions.LOGIN_FAILURE, errorMessage: new Error('Net ID must be filled out')}
  ]

  return store.dispatch(login('', 'banana')).then(() => {
    expect(store.getActions()).toEqual(expectedActions)
  })
})

it('should fail if credentials throws an error', () => {
  credentials.get = jest.fn().mockImplementation(() => Promise.reject(new Error('Garbage')))

  const expectedActions = [
    {type: actions.REQUEST_LOGIN, silentLogin: false},
    {type: actions.LOGIN_FAILURE, errorMessage: new Error('Could not retrieve stored credentials')}
  ]

  return store.dispatch(login('', '123password!')).then(() => {
    expect(store.getActions()).toEqual(expectedActions)
  })
})

it('should log user in if provided netid matches session', () => {
  const netid = 'fake_103'
  const password = '123password!'
  const tracsID = '45d8e9e7-0b87-4f2d-b5da-b5cfb69ba544'

  axiosMock.onGet(`${global.urls.baseUrl}${global.urls.session}`).reply(200, {
    "attributeNames": {},
    "attributes": null,
    "creationTime": 1532445477201,
    "currentTime": 1532452039266,
    "id": null,
    "lastAccessedTime": 1532452039265,
    "maxInactiveInterval": 1800,
    "userEid": netid,
    "userId": tracsID,
    "active": true,
    "entityReference": "\/session",
    "entityURL": "http:\/\/localhost:8080\/direct\/session",
    "entityTitle": "current"
  })

  const expectedActions = [
    {type: actions.REQUEST_LOGIN, silentLogin: false},
    {type: actions.LOGIN_SUCCESS, netid, password, tracsID}
  ]

  return store.dispatch(login(netid, password)).then(() => {
    expect(store.getActions()).toEqual(expectedActions)
  })
})

it('should fail to log user in if password is empty', () => {
  const netid = 'f_k10344'
  const password = ''

  const expectedActions = [
    {type: actions.REQUEST_LOGIN, silentLogin: false},
    {type: actions.LOGIN_FAILURE, errorMessage: new Error('Password must be filled out')}
  ]

  return store.dispatch(login(netid, password)).then(() => {
    expect(store.getActions()).toEqual(expectedActions)
  })
})

it('should log user in if netid and password are correct', () => {
  const netid = 'fak103'
  const password = '#43jiera094%%'
  const tracsID = '45d8e9e7-0b87-4f2d-b5da-b5cfb69ba544'

  const sessionURL = `${global.urls.baseUrl}${global.urls.session}`
  const loginURL = `${global.urls.baseUrl}/portal/relogin?eid=${netid}&pw=${encodeURIComponent(password)}`
  credentials.store = () => Promise.resolve()

  axiosMock.onGet(sessionURL)
    .replyOnce(200, noSessionResponse)

  axiosMock.onGet(sessionURL)
    .replyOnce(
      200,
      validSessionResponse(netid, tracsID),
      {'content-type': 'application/json'}
    )

  axiosMock.onPost(loginURL)
    .replyOnce(200, '<html></html>')

  const expectedActions = [
    {type: actions.REQUEST_LOGIN, silentLogin: false},
    {type: actions.LOGIN_SUCCESS, netid, password, tracsID}
  ]

  store.dispatch(login(netid, password)).then(() => {
    expect((store.getActions())).toEqual(expectedActions)
  })
})

it('should not log user in if session is for the wrong user', () => {
  const netid = 'fak103'
  const password = '#43jiera094%%'
  const tracsID = '45d8e9e7-0b87-4f2d-b5da-b5cfb69ba544'

  const sessionURL = `${global.urls.baseUrl}${global.urls.session}`
  const loginURL = `${global.urls.baseUrl}/portal/relogin?eid=${netid}&pw=${encodeURIComponent(password)}`
  credentials.store = () => Promise.resolve()

  axiosMock.onGet(sessionURL)
    .replyOnce(200, noSessionResponse)

  axiosMock.onPost(loginURL).reply(200, '<html></html>')

  axiosMock.onGet(sessionURL)
    .reply(
      200,
      validSessionResponse('wrongNetid2103', tracsID),
      {'content-type': 'application/json'}
    )


  const expectedActions = [
    {type: actions.REQUEST_LOGIN, silentLogin: false},
    {
      type: actions.LOGIN_FAILURE,
      errorMessage: new Error('There was a problem logging you into TRACS. Please try again later.')
    }
  ]

  return store.dispatch(login(netid, password)).then(() => {
    expect((store.getActions())).toEqual(expectedActions)
  })
})

it('should not log user in if the session is invalid after login', () => {
  const netid = 'fak103'
  const password = '#43jiera094%%'

  const sessionURL = `${global.urls.baseUrl}${global.urls.session}`
  const loginURL = `${global.urls.baseUrl}/portal/relogin?eid=${netid}&pw=${encodeURIComponent(password)}`
  credentials.store = () => Promise.resolve()

  axiosMock.onGet(sessionURL)
    .replyOnce(200, noSessionResponse)

  axiosMock.onGet(sessionURL)
    .replyOnce(
      200,
      noSessionResponse,
      {'content-type': 'application/json'}
    )

  axiosMock.onPost(loginURL)
    .replyOnce(200, '<html></html>')

  const expectedActions = [
    {type: actions.REQUEST_LOGIN, silentLogin: false},
    {
      type: actions.LOGIN_FAILURE,
      errorMessage: new Error('Net ID or password is incorrect.')
    }
  ]

  return store.dispatch(login(netid, password)).then(() => {
    expect((store.getActions())).toEqual(expectedActions)
  })
})

it('should not log user in if the session is undefined after login', () => {
  const netid = 'fak103'
  const password = '#43jiera094%%'

  const sessionURL = `${global.urls.baseUrl}${global.urls.session}`
  const loginURL = `${global.urls.baseUrl}/portal/relogin?eid=${netid}&pw=${encodeURIComponent(password)}`
  credentials.store = () => Promise.resolve()

  axiosMock.onGet(sessionURL)
    .replyOnce(200, noSessionResponse)

  axiosMock.onGet(sessionURL)
    .replyOnce(
      200,
      undefined,
      {'content-type': 'application/json'}
    )

  axiosMock.onPost(loginURL)
    .replyOnce(200, '<html></html>')

  const expectedActions = [
    {type: actions.REQUEST_LOGIN, silentLogin: false},
    {
      type: actions.LOGIN_FAILURE,
      errorMessage: new Error('There was a problem logging you into TRACS. Please try again later.')
    }
  ]

  return store.dispatch(login(netid, password)).then(() => {
    expect((store.getActions())).toEqual(expectedActions)
  })
})