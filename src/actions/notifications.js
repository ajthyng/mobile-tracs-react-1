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
import FCM from 'react-native-fcm';

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

const getNotificationDetail = (notifications) => {
	//1. Check cache for notification
	//2. If it's there, check update status
	//3. If it's an update, fetch new data
	//4. If it's not there, fetch new data
	//5. If it is there, add it to the display list
	//6. Wait for data to return
	//7. Combine fetched and stored data into one display list
	//8. We're done here.
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
			.then(data => {
				if (data) {
					dispatch(notificationSuccess(data));
				}
			}).catch(err => {
				dispatch(notificationsFailure(err.message));
		});
	}
};