/**
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import { applyMiddleware } from 'redux'

const isFunction = arg => typeof arg === 'function'

export default function configureStore (middlewares = []) {
	return function mockStore (getState = {}) {
		function mockStoreWithoutMiddleware () {
			let actions = []
			let listeners = []

			const self = {
				getState () {
					return isFunction(getState) ? getState(actions) : getState
				},

				getActions () {
					return actions
				},

				dispatch (action) {
					if (typeof action === 'undefined') {
						throw new Error(
							'Actions may not be an undefined.'
						)
					}

					if (typeof action.type === 'undefined') {
						throw new Error(
							'Actions may not have an undefined "type" property. ' +
							'Have you misspelled a constant? ' +
							'Action: ' +
							JSON.stringify(action)
						)
					}

					actions.push(action)

					for (let i = 0; i < listeners.length; i++) {
						listeners[i]()
					}

					return action
				},

				clearActions () {
					actions = []
				},

				subscribe (cb) {
					if (isFunction(cb)) {
						listeners.push(cb)
					}

					return () => {
						const index = listeners.indexOf(cb)

						if (index < 0) {
							return
						}
						listeners.splice(index, 1)
					}
				},

				replaceReducer (nextReducer) {
					if (!isFunction(nextReducer)) {
						throw new Error('Expected the nextReducer to be a function.')
					}
				}
			}

			return self
		}

		const mockStoreWithMiddleware = applyMiddleware(
			...middlewares
		)(mockStoreWithoutMiddleware)

		return mockStoreWithMiddleware()
	}
}