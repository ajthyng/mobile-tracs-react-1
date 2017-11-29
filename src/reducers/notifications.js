/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {notificationActions} from '../constants/actions';
import {types} from '../constants/notifications'
const {REQUEST_NOTIFICATIONS, NOTIFICATIONS_SUCCESS, NOTIFICATIONS_FAILURE} = notificationActions;

const initialState = {
	isLoading: false,
	isLoaded: false,
	errorMessage: "",
};

const requestNotifications = (state, action) => {
	return {
		...state,
		isLoading: true,
		isLoaded: false,
		errorMessage: "",
	}
};

const notificationsSuccess = (state, action) => {
	let notifs = {};
	Object.keys(types).forEach(type => {
		notifs[types[type]] = [];
	});
	for (const notification in action.notifications) {
		if (action.notifications.hasOwnProperty(notification)) {
			let notif = action.notifications[notification];
			notifs[notif.keys.object_type].push(notif);
		}
	}
	return {
		...state,
		isLoading: false,
		isLoaded: true,
		errorMessage: "",
		announcements: notifs[types.ANNOUNCEMENT],
		forums: notifs[types.FORUM]
	}
};

const notificationsFailure = (state, actions) => {
	return {
		...initialState,
		errorMessage: actions.errorMessage,
	}
};

export const notificationsReducer = (state = initialState, action) => {
	switch (action.type) {
		case REQUEST_NOTIFICATIONS: return requestNotifications(state, action);
		case NOTIFICATIONS_SUCCESS: return notificationsSuccess(state, action);
		case NOTIFICATIONS_FAILURE: return notificationsFailure(state, action);
		default: return state;
	}
};