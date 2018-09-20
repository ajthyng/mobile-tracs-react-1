/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import axios from 'axios'

export let haxios = axios.create()
haxios.defaults.maxRedirects = 0
haxios.defaults.retries = 5
haxios.defaults.retryCount = 0
haxios.defaults.baseRetryDelay = 322

haxios.interceptors.request.use(function headerAddition (config) {
  config.headers['Cache-Control'] = 'no-cache'
  return config
}, undefined)

haxios.interceptors.response.use(undefined, function retryInterceptor (error) {
  let config = error.config || {}
  const response = error.response || {}
  const shouldAbort = response.status >= 400 && response.status < 500

  if (shouldAbort) {
    return Promise.reject(error)
  }

  if (config.retryCount >= config.retries) {
    return Promise.reject(error)
  }

  config.retryCount += 1

  const retryDelay = Math.pow(2, config.retryCount - 1) * config.baseRetryDelay

  const backoff = new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, retryDelay)
  })

  return backoff.then(() => haxios(config))
})
