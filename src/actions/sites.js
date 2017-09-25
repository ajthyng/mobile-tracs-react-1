/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import * as Storage from '../utils/storage'
import * as types from '../constants/actions';

let {GET_MEMBERSHIPS} = types.sitesActions;

const getMemberships = (sites) => {
	return {
		type: GET_MEMBERSHIPS,
		sites: sites,
	}
};

let getSiteName = (siteID) => {
	let siteNameOptions = {
		url: `https://staging.tracs.txstate.edu/direct/site/${siteID}.json`,
		method: 'get',
	};
	return fetch(siteNameOptions);
};

let getSiteTools = (siteID) => {
	let siteToolOptions = {
		url: `https://staging.tracs.txstate.edu/direct/site/${siteID}/pages.json`,
		method: 'get'
	};
	return fetch(siteToolOptions);
};

let getAllSites = (payload) => {
	const {siteIds, storedSites} = payload;
	let userSites = [];
	let siteTools = [];
	let allSites = {};
	let promiseStart = new Date().getTime();

	let sitePromises = siteIds.map(siteID => {
		if (storedSites === null || !storedSites.hasOwnProperty(siteID)) {
			return getSiteName(siteID)
				.then(res => res.json())
				.then(site => userSites.push(site));
		}
	});

	let toolPromises = siteIds.map(siteID => {
		if (storedSites === null || !storedSites.hasOwnProperty(siteID)) {
			return getSiteTools(siteID)
				.then(res => res.json())
				.then(tools => {
					siteTools.push(tools)
				});
		}
	});

	let allPromises = [
		...sitePromises,
		...toolPromises
	];

	return Promise.all(allPromises).then(() => {
		userSites.forEach(site => {
			let contactInfo = {
				name: "Contact Name Not Found",
				email: "Contact Email Not Found"
			};
			if (site.props) {
				if (site.props['contact-name']) {
					contactInfo.name = site.props['contact-name'];
				}
				if (site.props['contact-email']) {
					contactInfo.email = site.props['contact-email'];
				}
			}

			allSites[site.id] = {
				id: site.id,
				name: site.title,
				contactInfo,
				tools: {}
			};

		});

		siteTools.forEach(site => {
			site.forEach(toolList => {
				if (toolList.hasOwnProperty("tools")) {
					toolList.tools.forEach(tool => {
						allSites[tool.siteId].tools[tool.toolId] = tool.pageId;
					});
				}
			});
		});

		Storage.sites.store(allSites).then(() => {
			console.log(`${Object.keys(allSites).length} sites stored.`);
		});
		const end = new Date().getTime();
		console.log(`Sites info fetched in ${end - promiseStart} ms.`);
		return allSites;
	});
};

export function getSiteInfo() {
	if (!Array.prototype.last) {
		Array.prototype.last = function () {
			return this[this.length - 1];
		}
	}
	return (dispatch) => {
		const options = {
			url: "https://staging.tracs.txstate.edu/direct/membership.json",
			method: "get"
		};

		return fetch(options)
			.then(res => {
				if (res.ok) {
					return res.json()
				} else {
					throw new Error(`${res.status} code received`);
				}
			})
			.then(sites => {
				const userHasSites = sites !== undefined && sites.hasOwnProperty('membership_collection') && sites.membership_collection.length > 0;
				if (!userHasSites) {
					throw new Error("User has no sites membership");
				}
				let siteIds = sites.membership_collection.map((site) => {
					return site.id.split(':').last();
				});
				return Storage.sites.get()
					.then(async data => {
						let storedSites = JSON.parse(data);
						const payload = {
							siteIds,
							storedSites
						};
						let userSites = await getAllSites(payload);
						return dispatch(getMemberships(userSites));
					})
			}).catch(error => {
				console.log("Sites Error: ", error);
				return dispatch(getMemberships({}));
			});
	}
}
