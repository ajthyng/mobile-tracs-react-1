import configureMockStore from '../mocks/store'
import thunk from 'redux-thunk'
import {getFavorites, getSiteInfo, setFilterStatus} from '../../src/actions/sites'
import {initialState} from '../../src/reducers/sites'
import {sitesActions as actions} from '../../src/constants/actions'
import * as Networking from '../../src/utils/networking'
import axios from 'axios'
import emptyMemberships from '../responses/sites/emptyMemberships.json'
import fullMemberships from '../responses/sites/fullMemberships.json'
import expectedSites from '../responses/sites/expectedSites.json'
import expectedTools from '../responses/sites/expectedTools.json'
import userSites from '../responses/sites/userSites.json'
import * as urls from '../../config/urls'
import MockAdapter from 'axios-mock-adapter'
import {toggleStatus} from '../../src/constants/sites'
import {Analytics} from '../../src/utils/analytics'

const {FAVORITES, ALL_SITES} = toggleStatus
jest.mock('../../src/utils/analytics')

Networking.haxios = axios

const middleware = [thunk]
const mockStore = configureMockStore(middleware)
const axiosMock = new MockAdapter(axios)
const netid = 'fak103'
global.urls = urls
jest.mock('../../src/utils/analytics')

describe('favorites actions', () => {
  let store = null

  const requestFavorites = {
    type: actions.REQUEST_FAVORITES
  }
  const favoritesSuccess = favs => ({
    type: actions.FAVORITES_SUCCESS,
    favorites: favs
  })
  const favoritesFailure = (message) => ({
    type: actions.FAVORITES_FAILURE,
    error: new Error(message)
  })
  const favoritesUrl = `${global.urls.baseUrl}${global.urls.favorites}`

  beforeEach(() => {
    store = mockStore({})
    axiosMock.resetHandlers()
  })

  it('should get a list of favorites', () => {
    const favs = '1;2;3'
    axiosMock.onGet(favoritesUrl).reply(200, favs)
    
    return store.dispatch(getFavorites()).then(() => {
      const receivedActions = store.getActions()
      const expectedActions = [
        requestFavorites,
        favoritesSuccess(favs)
      ]

      expect(receivedActions).toEqual(expectedActions)
    })
  })

  it('should fail on response > 400', () => {
    const code = 403
    axiosMock.onGet(favoritesUrl).reply(code)

    return store.dispatch(getFavorites()).then(() => {
      const receivedActions = store.getActions()
      const expectedActions = [
        requestFavorites,
        favoritesFailure(`Request failed with status code ${code}`)
      ]

      expect(receivedActions).toEqual(expectedActions)
    })
  })
})

describe('filter status', () => {
  let store = null
  beforeEach(() => {
    store = mockStore(initialState)
  })

  it('should change filter to FAVORITES if option is invalid', () => {
    store.dispatch(setFilterStatus('BANANA-NANA'))
    const expectedActions = [{type: actions.SET_FILTER_STATUS, filterStatus: FAVORITES}]

    const receivedActions = store.getActions()

    expect(receivedActions).toEqual(expectedActions)
  })

  it('should default to FAVORITES', () => {
    expect(store.getState().filterStatus).toEqual(FAVORITES)
  })

  it('should set filter to ALL_SITES properly', () => {
    store.dispatch(setFilterStatus(ALL_SITES))

    const expectedActions = [{type: actions.SET_FILTER_STATUS, filterStatus: ALL_SITES}]
    const receivedActions = store.getActions() 

    expect(receivedActions).toEqual(expectedActions)
  })
})

describe('get sites action', () => {
  let store = null
  const sitesUrl = `${global.urls.baseUrl}${global.urls.sites(500, 0)}`

  beforeEach(() => {
    store = mockStore(initialState)
    axiosMock.resetHandlers()
  })

  it('should return empty sites if data is null or missing', () => {

    axiosMock.onGet(sitesUrl).reply(200, null)

    return store.dispatch(getSiteInfo(netid)).then(data => {
      const expectedActions = [
        {type: actions.REQUEST_SITES},
        {type: actions.SITES_SUCCESS, userSites: {}}
      ]
      const receivedActions = store.getActions()
      expect(receivedActions).toEqual(expectedActions)
    })
  })

  it('should return empty tools object if props has no tools', () => {
    const siteOne = {
      id: '3423190-15',
      title: 'siteTitle',
      props: {
        'contact-name': 'Jim',
        'contact-email': 'jim@jimshouse.jim'
      },
      type: 'course'
    }
    const site_collection = [siteOne]
    
    axiosMock.onGet(sitesUrl).reply(200, {site_collection})
    return store.dispatch(getSiteInfo(netid)).then(data => {
      const successActions = store.getActions().filter(({type}) => type === actions.SITES_SUCCESS)
      const successSite = successActions[0].userSites[siteOne.id]
      expect(successActions.length).toBe(1)
      expect(successSite.tools).toMatchObject({})
    })
  })

  it('should not fail if props has invalid shape', () => {
    const siteOne = {
      id: '3423190-15',
      title: 'siteTitle',
      props: 'i\'m a truthy value but not an object or array',
      type: 'course'
    }
    const site_collection = [siteOne]
    
    axiosMock.onGet(sitesUrl).reply(200, {site_collection})
    return store.dispatch(getSiteInfo(netid)).then(data => {
      const successActions = store.getActions().filter(({type}) => type === actions.SITES_SUCCESS)
      const receivedSite = successActions[0].userSites[siteOne.id]

      expect(receivedSite.contactInfo).toMatchObject({
        name: null,
        email: null
      })
    })
  })

  it('parse two tools', () => {
    const siteOne = {
      id: '3423190-15',
      title: 'siteTitle',
      props: {
        'sakai.announcements': '{"parsed": true}',
        'sakai.forums': '{"parsed": true}',
        'announcements': 'not json',
        'contact-name': 'andrew'
      },
      type: 'course'
    }
    const site_collection = [siteOne]
    
    axiosMock.onGet(sitesUrl).reply(200, {site_collection})
    return store.dispatch(getSiteInfo(netid)).then(data => {
      const expectedActions = [
        {type: actions.REQUEST_SITES},
        {type: actions.SITES_SUCCESS, userSites: {
          [siteOne.id]: {
            id: siteOne.id,
            name: siteOne.title,
            contactInfo: {name: 'andrew', email: null},
            tools: {
              'sakai.announcements': {parsed: true},
              'sakai.forums': {parsed: true}
            },
            owner: netid,
            type: siteOne.type,
            forumCount: 0,
            unseenCount: 0
          }
        }}
      ]
      const receivedActions = store.getActions()

      expect(receivedActions).toEqual(expectedActions)
    })
  })
})