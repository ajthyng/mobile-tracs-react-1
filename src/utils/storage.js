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
import moment from 'moment';
import Realm from 'realm';

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
		return Keychain.resetGenericPassword().catch(err => console.tron.log(err));
	}
};

const FirstLoadSchema = {
	name: 'FirstLoad',
	properties: {
		isFirstLoad: {type: 'bool', default: true}
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

const NotificationSchema = {
	name: 'Notification',
	primaryKey: 'id',
	properties: {
		id: 'string',
		sent: 'bool',
		seen: 'bool',
		read: 'bool',
		cleared: 'bool',
		replaced: 'bool',
		is_update: 'bool',
		errors: 'bool',
		content_hash: 'string',
		send_updates: 'bool',
		notify_after: 'date',
		keys: 'Keys',
		other_keys: 'OtherKeys',
		tracs_data: 'TracsData'
	}
};

const KeysSchema = {
	name: 'Keys',
	properties: {
		notification_type: 'string',
		object_id: 'string',
		object_type: 'string',
		provider_id: 'string',
		user_id: 'string'
	}
};

const OtherKeysSchema = {
	name: 'OtherKeys',
	properties: {
		site_id: 'string'
	}
};

/**
 * Contains the properties that could possibly be received under any notification.
 * They are all optional because you should never trust the TRACS API to deliver consistent information.
 *
 */
const TracsDataSchema = {
	name: 'TracsData',
	properties: {
		announcementId: 'string?',
		body: 'string?',
		channel: 'string?',
		createdByDisplayName: 'string?',
		createdOn: 'int?',
		id: 'string?',
		siteId: 'string?',
		siteTitle: 'string?',
		title: 'string?',
		entityReference: 'string?',
		entityURL: 'string?',
		entityId: 'string?',
		entityTitle: 'string?',
		authorId: 'string?',
		authoredBy: 'string?',
		lastModified: 'int?',
		messageId: 'int?',
		readMessages: 'int?',
		replyTo: 'int?',
		topicId: 'int?',
		totalMessages: 'int?',
		deleted: 'bool?',
		draft: 'bool?',
		read: 'bool?',
		type: 'string?',
		topic_title: 'string?'
	}
};

const StorageRealm = Realm.open({
	schema: [
		SiteSchema,
		ContactSchema,
		ToolSchema,
		NotificationSchema,
		KeysSchema,
		OtherKeysSchema,
		TracsDataSchema,
		FirstLoadSchema
	]
}).then(realm => realm);

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
		let siteRealm = await StorageRealm;
		let sites = {};
		try {
			sites = siteRealm.objects('Site');
			sites = sites.reduce((accum, site) => {
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
		let siteRealm = await StorageRealm;
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
	async reset() {
		let siteRealm = await StorageRealm;
		siteRealm.write(() => {
			siteRealm.deleteAll();
		});
	},
	async clean(siteIDs) {
		let siteRealm = await StorageRealm;
		try {
			siteRealm.write(() => {
				let sites = siteRealm.objects('Site');
				sites.forEach(site => {
					if (siteIDs.indexOf(site.id) === -1) {
						siteRealm.delete(site);
					}
				});
			});
		} catch (err) {
			console.tron.log(err.message);
		}
	}
};

exports.notifications = {
	async get() {
		let notificationRealm = await StorageRealm;
		let notifications = notificationRealm
			.objects('Notification')
			.reduce((accum, notification) => {
				accum[notification.id] = {
					...notification
				};
				return accum;
			}, {});
		return Promise.resolve(notifications);
	},
	async store(notifications) {
		let notificationRealm = await StorageRealm;
		try {
			let storedNotifications = notificationRealm.objects('Notification');
			storedNotifications.forEach(notification => {
				if (Object.keys(notifications).indexOf(notification.id) < 0) {
					notificationRealm.write(() => {
						notificationRealm.delete(notification);
					});
				}
			});
			notificationRealm.write(() => {
				let realmNotifications = Object.keys(notifications).map(id => {
					let notif = notifications[id];
					return {
						id: id,
						sent: notif.sent,
						seen: notif.seen,
						read: notif.read,
						cleared: notif.cleared,
						replaced: notif.replaced,
						is_update: notif.is_update,
						errors: notif.errors,
						content_hash: notif.content_hash,
						send_updates: notif.send_updates,
						notify_after: notif.notify_after,
						keys: {
							notification_type: (notif.keys || {}).notification_type || null,
							object_id: (notif.keys || {}).object_id || null,
							object_type: (notif.keys || {}).object_type || null,
							provider_id: (notif.keys || {}).provider_id || null,
							user_id: (notif.keys || {}).user_id || null
						},
						other_keys: {
							site_id: (notif.other_keys || {}).site_id || null,
						},
						tracs_data: {
							announcementId: (notif.tracs_data || {}).announcementId || null,
							body: (notif.tracs_data || {}).body || null,
							channel: (notif.tracs_data || {}).channel || null,
							createdByDisplayName: (notif.tracs_data || {}).createdByDisplayName || null,
							createdOn: (notif.tracs_data || {}).createdOn || null,
							id: (notif.tracs_data || {}).id || null,
							siteId: (notif.tracs_data || {}).siteId || null,
							siteTitle: (notif.tracs_data || {}).siteTitle || null,
							title: (notif.tracs_data || {}).title || null,
							entityReference: (notif.tracs_data || {}).entityReference || null,
							entityURL: (notif.tracs_data || {}).entityURL || null,
							entityId: (notif.tracs_data || {}).entityId || null,
							entityTitle: (notif.tracs_data || {}).entityTitle || null,
							authorId: (notif.tracs_data || {}).authorId || null,
							authoredBy: (notif.tracs_data || {}).authoredBy || null,
							lastModified: (notif.tracs_data || {}).lastModified || null,
							messageId: (notif.tracs_data || {}).messageId || null,
							readMessages: (notif.tracs_data || {}).readMessages || null,
							replyTo: (notif.tracs_data || {}).replyTo || null,
							topicId: (notif.tracs_data || {}).topicId || null,
							totalMessages: (notif.tracs_data || {}).totalMessages || null,
							deleted: (notif.tracs_data || {}).deleted || null,
							draft: (notif.tracs_data || {}).draft || null,
							read: (notif.tracs_data || {}).read || null,
							type: (notif.tracs_data || {}).type || null,
							topic_title: (notif.tracs_data || {}).topic_title || null
						}
					}
				});
				realmNotifications.forEach(notification => {
					notificationRealm.create('Notification', notification, true);
				})
			});
			return Promise.resolve(true);
		} catch (err) {
			console.tron.log(`Realm Error: ${err.message}`);
			return Promise.resolve(false);
		}
	},
	async update(ids, status) {
		let notificationRealm = await StorageRealm;
		let notifications = notificationRealm.objects('Notification');
		try {
			notificationRealm.write(() => {
				ids.forEach(id => {
					let notif = notifications.filtered('id == $0', id);
					notif.forEach(notification => {
						let {seen, read, cleared} = status;
						notification.seen = seen || notification.seen;
						notification.read = read || notification.read;

						if (!!cleared) {
							notificationRealm.delete(notification);
						} else {
							notificationRealm.create('Notification', notification, true);
						}
					});
				});
			});
		} catch (err) {
			console.tron.log(`Realm Error: ${err.message}`);
		}
	},
	async reset() {
		let notificationRealm = await StorageRealm;
		notificationRealm.write(() => {
			notificationRealm.deleteAll();
		});
	},
	async delete(id) {
		let notificationRealm = await StorageRealm;
		notificationRealm.write(() => {
			let notif = notificationRealm.objects('Notification').filtered('id == $0', id);
			if (notif) {
				notificationRealm.delete(notif);
			}
		});
	}
};

exports.clear = async () => {
	let realm = await StorageRealm;
	try {
		realm.write(() => {
			realm.deleteAll();
		});
	} catch (err) {
		console.tron.log(`Delete All Error: ${err.message}`);
	}
};