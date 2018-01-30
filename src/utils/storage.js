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
import moment from 'moment';
import {types} from '../constants/notifications';
import Realm from 'realm';

const {
	FORUM,
	ANNOUNCEMENT
} = types;
const expiryDays = 90;
const msPerDay = 1000 * 3600 * 24;

const keys = {
	token: 'token',
	sites: 'sites',
	notifications: 'notifications'
};

exports.credentials = {
	get() {
		return LockStatus().then(secure => {
			if (secure === true) {
				console.log("Device Secure, fetching credentials");
				return Keychain.getGenericPassword();
			} else {
				console.log("Device not secure, removing credentials");
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
		return Keychain.resetGenericPassword();
	}
};

exports.token = {
	async get() {
		//const realm = await Realm.open({schema: [TokenSchema]});
		//realm.write(() => {
		//	realm.create('Token', {
		//		deviceToken: 'testToken'
		//	});
		//});
		//const tokens = realm.objects('Token');
		//console.log(tokens.length);
		return AsyncStorage.getItem(keys.token);
	},
	store(token) {
		return AsyncStorage.setItem(keys.token, token);
	},
	reset() {
		return AsyncStorage.removeItem(keys.token);
	}
};

const SiteSchema = {
	name: 'Site',
	primaryKey: 'id',
	properties: {
		id: 'string',
		contactInfo: 'Contact',
		expiration: 'date',
		name: 'string',
		owner: 'string',
		tools: 'Tool[]',
		type: 'string'
	}
};

const ContactSchema = {
	name: 'Contact',
	properties: {
		email: {type: 'string', default: 'tracs@txstate.edu'},
		name: {type: 'string', default: 'TRACS Support'}
	}
};

const ToolSchema = {
	name: 'Tool',
	properties: {
		type: 'string',
		id: 'string',
		pageId: 'string'
	}
};

const SiteRealm = Realm.open({schema: [SiteSchema, ContactSchema, ToolSchema]}).then(realm => realm);

exports.sites = {
	async get(netid) {
		let siteRealm = await SiteRealm;
		let sites = {};
		try {
			sites = siteRealm.objects('Site').reduce((accum, site) => {
				let tools = site.tools.reduce((accum, tool) => {
					accum[tool.type] = {
						id: tool.id,
						pageId: tool.pageId
					};
					return accum;
				}, {});
				accum[site.id] = {
					id: site.id,
					owner: site.owner,
					expiration: site.expiration,
					contactInfo: {
						name: site.contactInfo.name,
						email: site.contactInfo.email
					},
					type: site.type,
					name: site.name,
					tools: tools
				};
				return accum;
			}, {});
		} catch (error) {
			console.log(`%cRealm Error: ${error.message}`, 'background-color: red; color: white');
		}
		let filterSites = (sites) => {
			let filteredSites = {};
			if (sites !== null) {
				const siteIDs = Object.keys(sites);
				siteIDs.forEach(siteID => {
					if (sites[siteID].owner === netid) {
						filteredSites[siteID] = sites[siteID];
						filteredSites[siteID].expiration = moment(sites[siteID].expiration)
					}
				})
			}
			return Promise.resolve(filteredSites);
		};
		return filterSites(sites);
	},
	async store(sites, netid) {
		let realmSites = Object.keys(sites).map(id => {
			return {
				id: id,
				contactInfo: {email: sites[id].contactInfo.email, name: sites[id].contactInfo.name},
				expiration: moment().add(1, 'days').toDate(),
				name: sites[id].name,
				owner: netid,
				tools: [...Object.keys(sites[id].tools).map(tool => {
					return {type: tool, id: sites[id].tools[tool].id, pageId: sites[id].tools[tool].pageId}
				})],
				type: sites[id].type
			}
		});
		let siteRealm = await SiteRealm;
		try {
			siteRealm.write(() => {
				realmSites.forEach(site => {
					siteRealm.create('Site', site, true);
				});
			});
			return Promise.resolve(true);
		} catch (error) {
			console.log(`%cRealm Error: ${error.message}`, 'background-color: red; color: white');
			return Promise.resolve(false);
		}
	},
	reset() {
		return AsyncStorage.removeItem(keys.sites);
	},
	clean(siteIDs) {
		debugger;
		return AsyncStorage.getItem(keys.sites).then(stored => {
			stored = stored === null ? {} : JSON.parse(stored);
			const storedSiteIDs = Object.keys(stored);
			storedSiteIDs.forEach((siteID) => {
				if (siteIDs.indexOf(siteID) < 0) {
					console.log(`Deleting ${siteID}`);
					delete stored[siteID];
				}
			});
			return AsyncStorage.setItem(keys.sites, JSON.stringify(stored));
		});
	}
};

exports.notifications = {
	get() {
		return AsyncStorage.getItem(keys.notifications).then(stored => {
			stored = stored === null ? {} : JSON.parse(stored);
			Object.keys(stored).forEach(key => {
				Object.keys(stored[key]).forEach(notif => {
					//I don't think I actually need this
				});
			});
			return stored;
		});
	},
	store(notifications) {
		return AsyncStorage.getItem(keys.notifications).then(stored => {
			stored = stored === null ? {} : JSON.parse(stored);
			const storedNotifications = {
				...stored,
				...notifications
			};
			return AsyncStorage.setItem(keys.notifications, JSON.stringify(storedNotifications));
		});
	},
	remove(id) {
		function* reverseKeys(array) {
			let key = array.length - 1;
			while (key >= 0) {
				yield key;
				key -= 1;
			}
		}

		return AsyncStorage.getItem(keys.notifications).then(stored => {
			stored = stored === null ? {} : JSON.parse(stored);
			const types = Object.keys(stored);
			types.forEach(type => {
				for (let index of reverseKeys(stored[type])) {
					if (stored[type][index].id === id) {
						stored[type].splice(index, 1);
					}
				}
			});
			return AsyncStorage.setItem(keys.notifications, JSON.stringify(stored));
		});
	},
	reset() {
		return AsyncStorage.removeItem(keys.notifications);
	},
	clean(dispatchIDs) {
		let start = new Date();
		return AsyncStorage.getItem(keys.notifications).then(stored => {
			console.log(`Async Time: ${new Date() - start}ms`);
			stored = stored ? JSON.parse(stored) : {};
			const storedKeys = Object.keys(stored);
			storedKeys.forEach(key => {
				if (dispatchIDs.indexOf(key) < 0) {
					delete stored[key];
				}
			});
			return AsyncStorage.setItem(keys.notifications, JSON.stringify(stored));
		});
	}
};