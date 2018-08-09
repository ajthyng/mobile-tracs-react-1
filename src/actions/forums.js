/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import {forumActions} from '../constants/actions'
import {haxios as axios} from '../utils/networking'

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

const requestForums = () => ({
  type: REQUEST_FORUMS
})

const forumsSuccess = (forums) => ({
  type: FORUMS_SUCCESS,
  forums
})

const forumsFailure = (error) => ({
  type: FORUMS_FAILURE,
  errorMessage: error.message || 'No forums found'
})

export const getForums = (siteId) => {
  return dispatch => {
    dispatch(requestForums())
    const endpoint = siteId ? `/direct/forums/site/${siteId}.json` : '/direct/forums.json'
    const url = `${global.urls.baseUrl}${endpoint}`

    axios(url).then(res => {
      const forums = res.data.forums_collection

      if (!forums) {
        dispatch(forumsFailure(new Error('Could not retrieve forums')))
        return
      }

      dispatch(forumsSuccess(forums))
    }).catch(err => {
      dispatch(forumsFailure(err))
    })
  }
}

const requestTopics = () => ({
  type: REQUEST_TOPICS
})

const topicsSuccess = (topics, siteId, forum) => ({
  type: TOPICS_SUCCESS,
  topics,
  siteId,
  forum
})

const topicsFailure = (error) => ({
  type: TOPICS_FAILURE,
  errorMessage: error.message || 'No topics found'
})

export const getTopics = (siteId = null, forum = null) => {
  return dispatch => {
    dispatch(requestTopics())

    if (siteId === null || forum === null) {
      dispatch(topicsFailure(new Error('Topics can only be retrieved for a specific site and forum')))
      return
    }

    const endpoint = `/direct/forums/site/${siteId}/forum/${forum}.json`
    const url = `${global.urls.baseUrl}${endpoint}`

    axios(url).then(res => {
      const topics = res.data.topics || []

      dispatch(topicsSuccess(topics, siteId, forum))
    }).catch(err => {
      dispatch(topicsFailure(err))
    })
  }
}

const requestMessages = () => ({
  type: REQUEST_MESSAGES
})

const messagesSuccess = (messages, siteId, forum, topic) => ({
  type: MESSAGES_SUCCESS,
  messages,
  siteId,
  forum,
  topic
})

const messagesFailure = (error) => {
  return {
    type: MESSAGES_FAILURE,
    errorMessage: error.message || 'No messages found'
  }
}

export const getMessages = (siteId = null, forum = null, topic = null) => {
  return dispatch => {
    dispatch(requestMessages())
    if (siteId === null || forum === null || topic === null) {
      dispatch(messagesFailure(new Error('Messages can only be retrieved on a specific topic')))
    }

    const endpoint = `/direct/forums/site/${siteId}/forum/${forum}/topic/${topic}.json`
    const url = `${global.urls.baseUrl}${endpoint}`

    axios(url).then(res => {
      const threads = res.data.threads || []
      dispatch(messagesSuccess(threads, siteId, forum, topic))
    }).catch(err => {
      dispatch(messagesFailure(err))
    })
  }
}