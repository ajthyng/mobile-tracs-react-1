/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {sites as Sites} from '../utils/storage'
import {sitesActions} from '../constants/actions';
import moment from 'moment';
import {Analytics} from '../utils/analytics';

let {GET_MEMBERSHIPS, IS_FETCHING_SITES, CLEAR_SITES, GET_SITES_FAILED} = sitesActions;

const getMemberships = (userSites, loadTime) => {
	Analytics().logSiteCounts(userSites);
	Analytics().logSiteLoadTime(loadTime);
	return {
		type: GET_MEMBERSHIPS,
		userSites: userSites,
	}
};

const isFetchingSites = (bool) => {
	return {
		type: IS_FETCHING_SITES,
		isFetchingSites: bool
	}
};

export const clearSites = () => {
	return {
		type: CLEAR_SITES,
		userSites: {}
	}
};

export const getSitesFailed = (bool) => {
	return {
		type: GET_SITES_FAILED,
		hasFailed: true
	}
};

export function getSiteInfo(netid) {
	if (!Array.prototype.last) {
		Array.prototype.last = function () {
			return this[this.length - 1];
		}
	}
	const tracsUrl = global.urls.baseUrl;

	return (dispatch) => {
		let start = new Date();
		dispatch(isFetchingSites(true));
		const options = {
			url: `${tracsUrl}${global.urls.membership}`,
			method: "get"
		};
		return fetch(options)
			.then(res => {
				if (res.ok) {
					return res.json()
				} else {
					dispatch(getSitesFailed(true));
				}
			})
			.then(async sites => {
				const userHasSites = sites !== undefined && sites.hasOwnProperty('membership_collection') && sites.membership_collection.length > 0;
				if (!userHasSites) {
					let siteLoadTime = new Date() - start;
					dispatch(getMemberships({}, siteLoadTime));
					dispatch(isFetchingSites(false));
					return;
				}
				let siteIds = sites.membership_collection.map((site) => {
					return site.id.split(':').last();
				});
				await cleanStorage(siteIds);
				return Sites.get(netid).then(storedSites => {
					const payload = {
						siteIds,
						storedSites,
						netid
					};
					return getAllSites(payload).then(userSites => {
						let allSites = {
							...userSites,
							...storedSites
						};
						let siteLoadTime = new Date() - start;
						dispatch(getMemberships(allSites, siteLoadTime));
						dispatch(isFetchingSites(false));
					});
				})
			});
	}
}

let cleanStorage = (siteIDs) => {
	return Sites.clean(siteIDs);
};

let getSiteName = (siteID) => {
	const tracsUrl = global.urls.baseUrl;
	let siteNameOptions = {
		url: `${tracsUrl}${global.urls.site(siteID)}`,
		method: 'get',
	};
	return fetch(siteNameOptions);
};

let getSiteTools = (siteID) => {
	const tracsUrl = global.urls.baseUrl;
	let siteToolOptions = {
		url: `${tracsUrl}${global.urls.tools(siteID)}`,
		method: 'get'
	};
	return fetch(siteToolOptions);
};

let getAllSites = (payload) => {
	const {siteIds, storedSites, netid} = payload;
	let userSites = [];
	let siteTools = [];
	let fetchedSites = {};
	let promiseStart = new Date().getTime();
	let sitePromises = siteIds.map(siteID => {
		let shouldFetch = true;
		if (storedSites !== null) {
			shouldFetch = !storedSites.hasOwnProperty(siteID) || storedSites[siteID].expiration - moment() < 0;
		}

		if (shouldFetch === true) {
			return getSiteName(siteID)
				.then(res => res.json())
				.then(site => Promise.resolve({type: 'site', site}))
				.catch(err => Promise.resolve(new Error("Couldn't fetch site name for site id " + siteID)));
		}
	});

	let toolPromises = siteIds.map(siteID => {
		let shouldFetch = true;
		if (storedSites !== null) {
			shouldFetch = !storedSites.hasOwnProperty(siteID) || storedSites[siteID].expiration - moment() < 0;
		}
		if (shouldFetch === true) {
			return getSiteTools(siteID)
				.then(res => res.json())
				.then(tools => {
					return Promise.resolve({type: 'tools', tools});
				}).catch(err => {
					return Promise.resolve(new Error("Couldn't fetch tools for site id " + siteID));
				});
		}
	});

	let allPromises = [
		...sitePromises,
		...toolPromises
	];

	return Promise.all(allPromises).then((data) => {
		data.forEach(entry => {
			if (entry instanceof Error) {
				console.log("Error: " + entry.message);
			} else {
				switch (entry.type) {
					case 'site':
						userSites.push(entry.site);
						break;
					case 'tools':
						siteTools.push(entry.tools);
						break;
					default:
						return;
				}
			}
		});

		userSites.forEach(site => {
			let contactInfo = {
				name: "TRACS Support",
				email: "tracs@txstate.edu"
			};
			if (site.props) {
				if (site.props['contact-name']) {
					contactInfo.name = site.props['contact-name'];
				}
				if (site.props['contact-email']) {
					contactInfo.email = site.props['contact-email'];
				}
			}

			fetchedSites[site.id] = {
				id: site.id,
				name: site.title,
				contactInfo,
				tools: {},
				owner: netid,
				type: site.type || 'project'
			};

		});

		siteTools.forEach(site => {
			site.forEach(toolList => {
				if (toolList.hasOwnProperty("tools")) {
					toolList.tools.forEach(tool => {
						fetchedSites[tool.siteId].tools[tool.toolId] = {
							pageId: tool.pageId,
							id: tool.id
						};
					});
				}
			});
		});

		Sites.store(fetchedSites, netid).then();
		const end = new Date().getTime();
		console.log(`Sites info fetched in ${end - promiseStart} ms.`);
		return fetchedSites;
	});
};
