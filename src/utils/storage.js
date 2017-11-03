/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
//import Storage from 'react-native-storage';
import * as Keychain from 'react-native-keychain';
import {AsyncStorage} from 'react-native';
import LockStatus from './lockstatus';
import moment from 'moment';

const expiryDays = 90;
const msPerDay = 1000 * 3600 * 24;

const keys = {
	token: 'token',
	sites: 'sites'
};

let stringify = (obj) => {
	return JSON.stringify(obj);
};

exports.credentials = {
	get() {
		return LockStatus().then(secure => {
			if (secure === true) {
				console.log("Device Secure, fetching credentials");
				return Keychain.getGenericPassword();
			} else {
				console.log("Device not secure, removing credentials");
				return Keychain.resetGenericPassword();
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
		return Keychain.resetGenericPassword();
	}
};

exports.token = {
	get() {
		return AsyncStorage.getItem(keys.token);
	},
	store(token) {
		return AsyncStorage.setItem(keys.token, token);
	},
	reset() {
		return AsyncStorage.removeItem(keys.token);
	}
};

exports.sites = {
	get(netid) {
		return AsyncStorage.getItem(keys.sites).then(sites => {
			let filteredSites = {};
			if (sites !== null) {
				sites = JSON.parse(sites);
				const siteIDs = Object.keys(sites);
				siteIDs.forEach(siteID => {
					if (sites.hasOwnProperty(siteID) && sites[siteID].owner === netid) {
						sites[siteID].expiration = moment(sites[siteID].expiration);
						filteredSites[siteID] = sites[siteID];
					}
				});
			}
			return filteredSites;
		});
	},
	store(sites, netid) {
		return AsyncStorage.getItem(keys.sites).then(storedSites => {
			storedSites = storedSites === null ? {} : JSON.parse(storedSites);
			const siteIDs = Object.keys(sites);
			siteIDs.forEach(siteID => {
				if (sites.hasOwnProperty(siteID)) {
					sites[siteID].owner = netid;
					sites[siteID].expiration = moment().add(1, 'days');
				}
			});
			sites = {...storedSites, ...sites};
			return AsyncStorage.setItem(keys.sites, stringify(sites));
		});
	},
	reset() {
		return AsyncStorage.removeItem(keys.sites);
	},
	clean(siteIDs, netid) {
		return AsyncStorage.getItem(keys.sites).then(stored => {
			stored = stored === null ? {} : JSON.parse(stored);
			const storedSiteIDs = Object.keys(stored);
			storedSiteIDs.forEach((siteID) => {
				if (siteIDs.indexOf(siteID) < 0) {
					console.log(`Deleting ${siteID}`);
					delete stored[siteID];
				}
			});
			return AsyncStorage.setItem(keys.sites, stringify(stored));
		});
	}
};