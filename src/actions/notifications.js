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
import FCM from 'react-native-fcm';
import {types} from '../constants/notifications';

const {
	REQUEST_NOTIFICATIONS,
	NOTIFICATIONS_SUCCESS,
	NOTIFICATIONS_FAILURE
} = notificationActions;

const requestNotifications = () => {
	return {
		type: REQUEST_NOTIFICATIONS
	}
};

const notificationSuccess = (notifications) => {
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
			return;
	}
};

const fetchAnnouncement = (notification) => {
	let url = `${global.urls.baseUrl}${global.urls.announcement(notification.other_keys.site_id, notification.keys.object_id)}`;
	return fetch(url).then(res => {
		if (res.ok) {
			return res.json();
		}
	}).then(notif => {
		if (notif) {
			return {
				id: notification.id,
				data: notif
			}
		} else {
			throw new Error("Could not retrieve notification");
		}
	}).catch(err => {
		return Promise.reject();
	});
};

const fetchForumPost = (notification) => {
	let messageUrl = `${global.urls.baseUrl}${global.urls.forumMessage(notification.keys.object_id)}`;
	let topicUrl = `${global.urls.baseUrl}${global.urls.forumTopic(notification.keys.object_id)}`;

	let forumPromises = [
		fetch(messageUrl).then(res => {
			if (res.ok) {
				return res.json();
			}
		}).then(message => {
			if (message) {
				message.type = "message";
				return message;
			}
		}),
		fetch(topicUrl).then(res => {
			if (res.ok) {
				return res.json();
			}
		}).then(topic => {
			if (topic) {
				topic.type = "topic";
				return topic;
			}
		})
	];

	return Promise.all(forumPromises).then(data => {
		let tracsData = {};
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
		return {
			id: notification.id,
			data: tracsData
		}
	});
};

const getNotificationDetail = async (notifications) => {
	await Storage.notifications.clean(Object.keys(notifications));
	return Storage.notifications.get().then(stored => {
		const storedIDs = Object.keys(stored);
		let notificationPromises = [];

		notifications = notifications.reduce((prev, curr) => {
			let next = {
				...prev
			};
			next[curr.id] = curr;
			return next;
		}, {});

		Object.keys(notifications).forEach(id => {
			let notification = notifications[id];
			const storedIndex = storedIDs.indexOf(notification.id);
			if (storedIndex > -1) {
				if (notification.is_update === true || !stored[notification.id].hasOwnProperty('tracs_data')) {
					notificationPromises.push(fetchNotification(notification));
				}
			} else {
				notificationPromises.push(fetchNotification(notification));
			}
		});

		return Promise.all(notificationPromises).then(async tracs => {
			let updatedNotifications = {};
			tracs.forEach((tracs_notif) => {
				let id = tracs_notif.id;
				updatedNotifications[id] = notifications[id];
				updatedNotifications[id].tracs_data = tracs_notif.data;
			});

			let notificationsToStore = {
				...stored,
				...updatedNotifications
			};

			await Storage.notifications.store(notificationsToStore);

			return notificationsToStore;
		});
	}).catch(err => {
		console.log(err);
	});
};

export const getNotifications = (token) => {
	return async (dispatch) => {
		dispatch(requestNotifications());
		if (!token) {
			await FCM.getFCMToken().then(deviceToken => token = deviceToken);
		}
		const dispatchURL = global.urls.dispatchUrl;
		const notificationURL = `${dispatchURL}${global.urls.getNotifications(token)}`;
		const options = {
			method: 'get'
		};
		fetch(notificationURL, options)
			.then(res => {
				if (res.ok) {
					return res.json();
				}
				const errorMessage = "Failed to retrieve notifications";
				dispatch(notificationsFailure(errorMessage));
			})
			.then(async data => {
				if (data) {
					let notifications = await getNotificationDetail(data);
					dispatch(notificationSuccess(notifications));
				}
			}).catch(err => {
				dispatch(notificationsFailure(err.message));
		});
	}
};