/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {ToastAndroid, NativeModules} from 'react-native';
import React from 'react';

let Toast = NativeModules.Toast;
let show = {};

const defaultMessage = "No message set.";

const LENGTH = Object.freeze({
	SHORT: global.android ? ToastAndroid.SHORT : "short",
	LONG: global.android ? ToastAndroid.LONG : "long"
});

if (global.android) {
	show = {
		create: function(message = defaultMessage, length = LENGTH.short) {
			ToastAndroid.show(message, length)
		}
	}
} else {
	show = {
		create: function(message = defaultMessage, length) {
			switch (length) {
				case LENGTH.SHORT:
					Toast.show({
						message,
						duration: length,
						position: 'bottom',
						addPixelsY: -50
					});
					break;
				case LENGTH.LONG:
					Toast.show({
						message,
						duration: length,
						position: 'bottom',
						addPixelsY: -50
					});
					break;
				default:
					Toast.show({
						message,
						durange: length,
						position: 'bottom',
						addPixelsY: -100
					});
					break;
			}
		}
	}
}

module.exports = {
	Toast: {
		LENGTH,
		show: show.create,
	}
};