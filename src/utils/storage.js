/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import * as Keychain from 'react-native-keychain';
import {AsyncStorage} from 'react-native';
import LockStatus from './lockstatus';
import FCM from 'react-native-fcm';
import PushNotification from 'react-native-push-notification';

exports.credentials = {
	get() {
		return Keychain.getGenericPassword().then(creds => {
			if (!!creds.username === false) {
				return Promise.resolve(false);
			} else {
				return Promise.resolve({
					username: creds.username,
					password: creds.password
				});
			}
		});
	},
	store(netid, password) {
		return Keychain.setGenericPassword(netid, password);
	},
	async reset() {
		let result = await Keychain.resetGenericPassword()
			.then(result => result)
			.catch(err => console.log(err));
		return Promise.resolve(result);
	}
};

/**
 * The following sections are still being called.
 * All the logic is in place to make it work but it's not necessary to cache at this time.
 */
exports.sites = {
	async getSites(netid) {
		return Promise.resolve({});
	},
	async store(sites, netid) {
		return Promise.resolve(true);
	},
	async clean(siteIDs) {
		return Promise.resolve(true);
	}
};

exports.notifications = {
	async getNotifications() {
		return Promise.resolve({});
	},
	async store(notifications) {
		return Promise.resolve(true);
	},
	async update(ids, status) {
		return Promise.resolve(true);
	},
	async reset() {
		return Promise.resolve(true);
	},
	async delete(id) {
		return Promise.resolve(true);
	}
};

exports.clear = async () => {
	return Promise.resolve(true);
};

exports.token = {
	async getDeviceToken() {
		if (global.android) {
			return FCM.getFCMToken().then(token => Promise.resolve(token));
		} else {
			return new Promise((resolve, reject) => {
				PushNotification.configure({
					onRegister: ({token, ios}) => {
						return resolve(token);
					}
				});
			});
		}
	}
}
;