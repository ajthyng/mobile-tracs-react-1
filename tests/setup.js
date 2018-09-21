import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
configure({ adapter: new Adapter() })

jest.mock('react-native-cookies', () => ({
  clearAll: jest.fn().mockImplementation(() => Promise.resolve(true))
}))

jest.mock('react-native-firebase', () => ({
  analytics: () => ({
    setAnalyticsCollectionEnabled: () => null,
    setUserId: (id) => null,
    setCurrentScreen: () => null,
    setUserProperty: () => null
  })
}))
