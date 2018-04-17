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
import * as Storage from '../utils/storage';
import {token as TokenStore} from '../utils/storage';
import {types} from '../constants/notifications';
import {Analytics} from '../utils/analytics';
import {haxios as axios} from '../utils/networking'

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

const requestNotifications = () => {
	return {
		type: REQUEST_NOTIFICATIONS
	}
};

const notificationSuccess = (notifications, loadTime) => {
	Analytics().logNotificationLoadTime(loadTime);
	return {
		type: NOTIFICATIONS_SUCCESS,
		notifications
	}
};

const notificationsFailure = (errorMessage) => {
	return {
		type: NOTIFICATIONS_FAILURE,
		errorMessage
	}
};

const fetchNotification = (notification) => {
	switch (notification.keys.object_type) {
		case types.ANNOUNCEMENT:
			return fetchAnnouncement(notification);
		case types.FORUM:
			return fetchForumPost(notification);
		default:
			return Promise.resolve(new Error("Could not fetch unknown notification type"));
	}
};

const fetchAnnouncement = (notification) => {
	let url = `${global.urls.baseUrl}${global.urls.announcement(notification.other_keys.site_id, notification.keys.object_id)}`;
	return axios(url).then(res => {
		return Promise.resolve({
			id: notification.id,
			data: res.data
		});
	}).catch(err => {
		return Promise.resolve(new Error("Could not fetch announcement id " + notification.id));
	});
};

const fetchForumPost = (notification) => {
	let messageUrl = `${global.urls.baseUrl}${global.urls.forumMessage(notification.keys.object_id)}`;
	let topicUrl = `${global.urls.baseUrl}${global.urls.forumTopic(notification.keys.object_id)}`;

	let forumPromises = [
		axios(messageUrl, {method: 'get'}).then(res => {
			if (res.data) {
				res.data.type = 'message';
				return Promise.resolve(res.data);
			}
		}).catch(err => {
			return Promise.resolve(new Error("Could not fetch forum message for id " + notification.id));
		}),
		axios(topicUrl, {method: 'get'}).then(res => {
			if (res.data) {
				res.data.type = 'topic';
				return Promise.resolve(res.data);
			}
		}).catch(err => {
			return Promise.resolve(new Error("Could not fetch forum topic title for id " + notification.id));
		}),
	];

	return Promise.all(forumPromises).then(data => {
		let tracsData = {};
		data = data.filter(entry => !(entry instanceof Error));
		data.forEach(item => {
			if (item.type === "topic") {
				tracsData.topic_title = item.title;
			} else if (item.type === "message") {
				tracsData = {
					...tracsData,
					...item
				}
			}
		});
		if (Object.keys(tracsData).length === 0) {
			return Promise.resolve(new Error("Could not process forum post data"));
		} else {
			return Promise.resolve({
				id: notification.id,
				data: tracsData
			});
		}
	});
};

const getNotificationDetail = async (notifications) => {
	let notificationPromises = [];
	notifications = notifications.reduce((accum, curr) => {
		accum[curr.id] = curr;
		return accum;
	}, {});

	Object.keys(notifications).forEach(id => {
		let notification = notifications[id];
		notificationPromises.push(fetchNotification(notification));
	});

	return Promise.all(notificationPromises).then(tracs => {
		let updatedNotifications = {};
		tracs = tracs.filter((notif) => {
			return !(notif instanceof Error);
		});
		tracs.forEach((tracs_notif) => {
			let id = tracs_notif.id;
			updatedNotifications[id] = notifications[id];
			updatedNotifications[id].tracs_data = tracs_notif.data;
		});
		return Promise.resolve(updatedNotifications);
	}).catch(err => console.log(err));
};

export const getNotifications = (token) => {
	return async (dispatch) => {
		let startTime = new Date();
		dispatch(requestNotifications());
		if (!token) {
			await TokenStore.getDeviceToken().then(deviceToken => token = deviceToken);
		}
		const dispatchURL = global.urls.dispatchUrl;
		const notificationURL = `${dispatchURL}${global.urls.getNotifications(token)}`;
		const options = {
			method: 'get'
		};
		axios(notificationURL, options).then(res => {
			if (res.data) {
				getNotificationDetail(res.data).then(notifications => {
					const loadTime = new Date() - startTime;
					dispatch(notificationSuccess(notifications, loadTime));
				});
			}
		}).catch(err => {
			dispatch(notificationsFailure(err.message));
		});
	}
};

const requestUpdateNotification = () => {
	return {
		type: REQUEST_NOTIFICATION_UPDATE
	}
};

const updateNotificationSuccess = (notification) => {
	return {
		type: NOTIFICATION_UPDATE_SUCCESS,
		notification
	}
};

const updateNotificationFailure = (errorMessage, notification) => {
	return {
		type: NOTIFICATION_UPDATE_FAILURE,
		notification,
		errorMessage
	}
};

const removeNotification = (notification) => {
	return {
		type: REMOVE_NOTIFICATION,
		notification
	}
};

export const updateNotification = (newNotif, oldNotif) => {
	return async (dispatch) => {
		dispatch(requestUpdateNotification());

		let token = await TokenStore.getDeviceToken().then(deviceToken => deviceToken);
		const dispatchURL = global.urls.dispatchUrl;
		const updateURL = `${dispatchURL}${global.urls.updateNotification(token, newNotif)}`;
		let updatedNotif = {...newNotif};
		delete updatedNotif.tracs_data;
		const options = {
			method: 'post',
			data: updatedNotif,
			headers: {
				'Content-Type': 'application/json'
			}
		};
		dispatch(removeNotification(oldNotif));

		return axios(updateURL, options).then(res => {
			Storage.notifications.delete(oldNotif.id);
			dispatch(updateNotificationSuccess(newNotif));
			dispatch(getNotifications(token));
		}).catch(err => {
			console.log(err);
			dispatch(updateNotificationFailure(err.message));
		});
	}
};

const requestBatchUpdate = () => {
	return {
		type: REQUEST_BATCH_UPDATE,
	}
};

const batchUpdateSuccess = (ids, status) => {
	return {
		type: BATCH_UPDATE_SUCCESS,
		status,
		ids
	}
};

const batchUpdateFailure = (errorMessage) => {
	return {
		type: BATCH_UPDATE_FAILURE,
		errorMessage
	}
};

export const batchUpdateNotification = (ids = [], status = {}, token) => {
	return async (dispatch) => {
		dispatch(requestBatchUpdate());
		if (ids.length === 0 || !Object.keys(status).some(key => true)) {
			return;
		}

		token = token ? token : await TokenStore.getDeviceToken().then(deviceToken => deviceToken);

		const url = `${global.urls.dispatchUrl}${global.urls.getNotifications(token)}`;
		const options = {
			method: 'patch',
			data: {ids: ids, patches: status}
		};
		return axios(url, options).then(res => {
			Storage.notifications.update(ids, status);
			dispatch(batchUpdateSuccess(ids, status));
		}).catch(err => {
			dispatch(batchUpdateFailure(err.message));
		});
	}
};