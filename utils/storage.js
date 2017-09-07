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
import { AsyncStorage } from 'react-native';

const expiryDays = 90;
const absurdMSConstant = 1000 * 36 * 24;

let storage = new Storage({
	storageBackend: AsyncStorage,
	defaultExpires: absurdMSConstant * expiryDays,
});

let keys = {
	credentials: 'credentials',
};

exports.credentials = {
	get: () => {
		return storage.load({
			key: keys.credentials,
			autoSync: false,
			syncInBackground: false,
		});
	},
	store: (netid, password, url) => {
		return storage.save({
			key: keys.credentials,
			data: {
				netid,
				password
			}
		});
	},
	reset: (url) => {
		return storage.remove({
			key: keys.credentials
		});
	}
};