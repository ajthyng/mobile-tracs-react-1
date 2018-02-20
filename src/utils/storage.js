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
import LockStatus from './lockstatus';

exports.credentials = {
	get() {
		return LockStatus().then(secure => {
			if (secure === true) {
				return Keychain.getGenericPassword();
			} else {
				return new Promise((resolve) => {
					Keychain.resetGenericPassword().then(didReset => {
						resolve(!didReset);
					});
				});
			}
		});
	},
	store(netid, password) {
		return LockStatus().then(secure => {
			if (secure === true) {
				console.log("Device Secure, saving credentials");
				return Keychain.setGenericPassword(netid, password);
			} else {
				console.log("Device not secure, removing credentials");
				return Keychain.resetGenericPassword();
			}
		});
	},
	reset() {
		return Keychain.resetGenericPassword().catch(err => console.log(err));
	}
};

exports.firstLoad = {
	async get() {
		return Keychain.getInternetCredentials('firstload')
			.then(credentials => {
				if (credentials) {
					return Promise.resolve(false);
				} else {
					return Keychain.setInternetCredentials('firstload', 'first', 'load').then(() => {
						return Promise.resolve(true);
					}).catch(() => {
						return Promise.resolve(false);
					});
				}
			}).catch(err => {
				return Promise.resolve(false);
			});
	}
};

exports.sites = {
	async get(netid) {
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
	async get() {
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