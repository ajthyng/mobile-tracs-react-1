import React from 'react'
import {shallow} from 'enzyme'
import LoginScreen from './LoginScreen'
import configureStore from '../../store/configureStore'
import {credentials} from '../../utils/storage'
import {Provider} from 'react-redux'

const {store} = configureStore()

it('should render the component with no netid or password', () => {
  credentials.get = jest.fn().mockImplementation(() => Promise.resolve(false))
  const wrapper = shallow(
    <Provider store={store}>
      <LoginScreen />
    </Provider>
  )

  expect(wrapper.containsMatchingElement(<LoginScreen />)).toBeTruthy()
})
