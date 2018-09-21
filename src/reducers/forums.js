/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import { forumActions } from '../constants/actions'

const {
  REQUEST_FORUMS,
  FORUMS_SUCCESS,
  FORUMS_FAILURE,
  REQUEST_TOPICS,
  TOPICS_SUCCESS,
  TOPICS_FAILURE,
  REQUEST_MESSAGES,
  MESSAGES_SUCCESS,
  MESSAGES_FAILURE
} = forumActions

const initialState = {
  forums: [],
  topics: {},
  messages: {},
  errorMessage: '',
  loadingForums: false,
  loadingTopics: false,
  loadingMessages: false
}

const requestForums = (state) => {
  return {
    ...state,
    loadingForums: true,
    errorMessage: ''
  }
}

const forumsSuccess = (state, action) => {
  return {
    ...state,
    forums: action.forums,
    loadingForums: false,
    errorMessage: ''
  }
}

const forumsFailure = (state, action) => {
  return {
    ...state,
    loadingForums: false,
    errorMessage: action.errorMessage
  }
}

const requestTopics = (state) => {
  return {
    ...state,
    loadingTopics: true,
    errorMessage: ''
  }
}

const topicsSuccess = (state, action) => {
  return {
    ...state,
    topics: {
      ...state.topics,
      [action.siteId]: {
        ...state.topics[action.siteId],
        [action.forum]: action.topics
      }
    },
    loadingTopics: false,
    errorMessage: ''
  }
}

const topicsFailure = (state, action) => {
  return {
    ...state,
    loadingTopics: false,
    errorMessage: action.errorMessage
  }
}

const requestMessages = (state) => {
  return {
    ...state,
    loadingMessages: true,
    errorMessage: ''
  }
}

const messagesSuccess = (state, action) => {
  return {
    ...state,
    messages: [
      ...state.messages,
      ...action.messages
    ],
    loadingMessages: false,
    errorMessage: ''
  }
}

const messagesFailure = (state, action) => {
  return {
    ...state,
    loadingMessages: false,
    errorMessage: action.errorMessage
  }
}

export function forumReducer (state = initialState, action) {
  switch (action.type) {
    case REQUEST_FORUMS: return requestForums(state, action)
    case FORUMS_SUCCESS: return forumsSuccess(state, action)
    case FORUMS_FAILURE: return forumsFailure(state, action)
    case REQUEST_TOPICS: return requestTopics(state, action)
    case TOPICS_SUCCESS: return topicsSuccess(state, action)
    case TOPICS_FAILURE: return topicsFailure(state, action)
    case REQUEST_MESSAGES: return requestMessages(state, action)
    case MESSAGES_SUCCESS: return messagesSuccess(state, action)
    case MESSAGES_FAILURE: return messagesFailure(state, action)
    default: return state
  }
}
