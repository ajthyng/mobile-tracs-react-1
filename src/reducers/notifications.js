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
import PushNotification from 'react-native-push-notification';

const {
	REQUEST_NOTIFICATIONS,
	NOTIFICATIONS_SUCCESS,
	NOTIFICATIONS_FAILURE,
	REQUEST_NOTIFICATION_UPDATE,
	NOTIFICATION_UPDATE_SUCCESS,
	NOTIFICATION_UPDATE_FAILURE,
	REMOVE_NOTIFICATION,
	REQUEST_BATCH_UPDATE,
	BATCH_UPDATE_SUCCESS,
	BATCH_UPDATE_FAILURE
} = notificationActions;

const initialState = {
	isLoading: false,
	isLoaded: false,
	isUpdating: false,
	isBatchUpdating: false,
	announcements: [],
	forums: [],
	badgeCounts: {},
	errorMessage: "",
};

const requestNotifications = (state, action) => {
	return {
		...state,
		isLoading: true,
		isLoaded: false,
		errorMessage: ""
	}
};
const countAnnouncements = (badgeCounts) => {
	return announcement => {
		let site_id = announcement.other_keys.site_id;
		if (!announcement.seen) {
			if (badgeCounts.hasOwnProperty(site_id)) {
				badgeCounts[site_id].unseenCount += 1;
			} else {
				badgeCounts[site_id] = {
					unseenCount: 1
				}
			}

			if (badgeCounts.hasOwnProperty('announceCount')) {
				badgeCounts.announceCount += 1;
			} else {
				badgeCounts.announceCount = 1;
			}
		}
	}
};

const countForums = (badgeCounts) => {
	return forum => {
		let site_id = forum.other_keys.site_id;
		if (!forum.seen) {
			if (badgeCounts.hasOwnProperty(site_id)) {
				badgeCounts[site_id].unseenCount += 1;
				if (badgeCounts[site_id].hasOwnProperty('forumCount')) {
					badgeCounts[site_id].forumCount += 1;
				} else {
					badgeCounts[site_id] = {
						...badgeCounts[site_id],
						forumCount: 1
					}
				}
			} else {
				badgeCounts[site_id] = {
					unseenCount: 1,
					forumCount: 1
				}
			}
		}
	}
};

const updateBadgeCount = (notifs) => {
	let badgeCounts = {};
	(notifs[types.ANNOUNCEMENT] || []).forEach(countAnnouncements(badgeCounts));
	(notifs[types.FORUM] || []).forEach(countForums(badgeCounts));
	return badgeCounts;
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

	let badgeCounts = updateBadgeCount(notifs);

	if (global.ios) {
		let appBadgeCount = (badgeCounts.announceCount || 0) + (badgeCounts.forumCount || 0);
		debugger;
		PushNotification.setApplicationIconBadgeNumber(appBadgeCount || 0);
	}

	return {
		...state,
		isLoading: false,
		isLoaded: true,
		errorMessage: "",
		badgeCounts: badgeCounts,
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

const requestNotificationUpdate = (state, action) => {
	return {
		...state,
		isBatchUpdating: true,
		errorMessage: ""
	}
};

const notificationUpdateSuccess = (state, action) => {
	return {
		...state,
		isBatchUpdating: false,
		errorMessage: ""
	};
};

const notificationUpdateFailure = (state, action) => {
	return {
		...state,
		isBatchUpdating: false,
		errorMessage: action.errorMessage
	}
};

const removeNotification = (state, action) => {
	let notification = action.notification;
	let index = null;
	switch (notification.keys.object_type) {
		case types.ANNOUNCEMENT:
			index = state.announcements.findIndex(i => i.id === notification.id);
			let announcements = [...state.announcements];
			announcements.splice(index, 1);
			return {
				...state,
				announcements: announcements || [],
				errorMessage: ""
			};
		case types.FORUM:
			index = state.forums.findIndex(i => i.id === notification.id);
			let forums = [...state.forums];
			forums.splice(index, 1);
			return {
				...state,
				forums: forums || [],
				errorMessage: ""
			};
		default:
			break;
	}

};

const requestBatchUpdate = (state, action) => {
	return {
		...state,
		isBatchUpdating: true,
		errorMessage: ""
	}
};

const updateStatus = (status, ids) => {
	return function(notif) {
		if (ids.indexOf(notif.id) > -1) {
			Object.keys(status).forEach(key => {
				notif[key] = status[key];
			});
		}
	};
};

const batchUpdateSuccess = (state, action) => {
	let ids = action.ids;
	let status = action.status;
	state.announcements.forEach(updateStatus(status, ids));
	state.forums.forEach(updateStatus(status, ids));

	let notifs = {};
	notifs[types.ANNOUNCEMENT] = [...(state.announcements ||[])];
	notifs[types.FORUM] = [...(state.forums || [])];

	let badgeCounts = updateBadgeCount(notifs);

	return {
		...state,
		isBatchUpdating: false,
		badgeCounts: badgeCounts,
		errorMessage: ""
	}
};

const batchUpdateFailure = (state, action) => {
	return {
		...state,
		isBatchUpdating: false,
		errorMessage: action.errorMessage
	}
};

export const notificationsReducer = (state = initialState, action) => {
	switch (action.type) {
		case REQUEST_NOTIFICATIONS: return requestNotifications(state, action);
		case NOTIFICATIONS_SUCCESS: return notificationsSuccess(state, action);
		case NOTIFICATIONS_FAILURE: return notificationsFailure(state, action);
		case REQUEST_NOTIFICATION_UPDATE: return requestNotificationUpdate(state, action);
		case NOTIFICATION_UPDATE_SUCCESS: return notificationUpdateSuccess(state, action);
		case NOTIFICATION_UPDATE_FAILURE: return notificationUpdateFailure(state, action);
		case REMOVE_NOTIFICATION: return removeNotification(state, action);
		case REQUEST_BATCH_UPDATE: return requestBatchUpdate(state, action);
		case BATCH_UPDATE_SUCCESS: return batchUpdateSuccess(state, action);
		case BATCH_UPDATE_FAILURE: return batchUpdateFailure(state, action);
		default: return state;
	}
};