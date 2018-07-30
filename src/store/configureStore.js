/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {createStore, applyMiddleware} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly'
import {persistStore, persistReducer, createTransform} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {initialState} from '../reducers/sites'

import thunk from 'redux-thunk'
import rootReducer from '../reducers/index'

const statusFilter = createTransform((inboundState, key) => {
  if (key === 'tracsSites') {
    return {toggleStatus: inboundState.toggleStatus}
  }
  return inboundState
}, (outboundState, key) => {
  if (key === 'tracsSites') {
    return {...initialState, toggleStatus: outboundState.toggleStatus}
  }
  return outboundState
})
const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['tracsSites', 'theme'],
  transforms: [statusFilter]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk))
)

const persistor = persistStore(store)

export default function configureStore() {
  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('../reducers/index').default
      store.replaceReducer(persistReducer(persistConfig, nextRootReducer))
    })
  }
  return {store, persistor}
}