/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import Storage from 'react-native-storage';
import * as Keychain from 'react-native-keychain';
import { AsyncStorage } from 'react-native';

const expiryDays = 90;
const absurdMSConstant = 1000 * 36 * 24;

let storage = new Storage({
	storageBackend: AsyncStorage,
	defaultExpires: absurdMSConstant * expiryDays,
});

let keys = {
	credentials: 'credentials',
	token: 'token',
};

exports.credentials = {
	get() {
		return Keychain.getGenericPassword();
	},
	store(netid, password) {
		return Keychain.setGenericPassword(netid, password);
	},
	reset() {
		return Keychain.resetGenericPassword();
	}
};

exports.token = {
	get() {
		return storage.load({
			key: keys.token,
			autoSync: false,
			syncInBackground: false,
		});
	},
	store(token) {
		return storage.save({
			key: keys.token,
			data: token
		});
	},
	reset() {
		return storage.remove({
			key: keys.token
		})
	}
}