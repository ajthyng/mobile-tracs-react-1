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

export const CLEAR_SITE_CACHE = 'CLEAR_SITE_CACHE';
export const UPDATE_SITES_CACHE = 'UPDATE_SITES_CACHE';
export const GET_MEMBERSHIPS = 'GET_MEMBERSHIPS';

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

let getAllSites = (siteIds, storedSites = {}) => {
	let userSites = [];
	let siteTools = [];
	let allSites = {};
	console.log(storedSites);
	let sitePromises = siteIds.map(async siteID => {
		if (!storedSites.hasOwnProperty(siteID)) {
			await getSiteName(siteID).then(res => {
				return res.json().then((data) => {
					userSites.push(data);
				});
			});
		}
	});

	let toolPromises = siteIds.map(async siteID => {
		if (!storedSites.hasOwnProperty(siteID)) {
			await getSiteTools(siteID).then(res => {
				return res.json().then(data => {
					siteTools.push(data);
				});
			});
		}
	});

	let promiseStart = new Date().getTime();
	Promise.all(sitePromises, toolPromises).then(() => {
		userSites.forEach((site) => {
			let contactInfo = {
				name: 'Not Found',
				email: 'Not Found'
			};
			if (site.props) {
				contactInfo.name = site.props['contact-name'];
				contactInfo.email = site.props['contact-email'];
			}
			allSites[site.id] = {
				id: site.id,
				name: site.title,
				contactInfo,
				tools: {}
			}
		});

		siteTools.forEach(site => {
			site.forEach(toolList => {
				toolList.tools.forEach(tool => {
					allSites[tool.siteId].tools[tool.toolId] = tool.pageId;
				});
			});
		});

		Storage.sites.store(allSites).then((result) => {
			console.log(`${Object.keys(allSites).length} sites stored.`);
		});
		const end = new Date().getTime();
		console.log(`Sites info fetched in ${end - promiseStart} ms.`);
	});
};

export function getMemberships() {
	return (dispatch) => {
		const options = {
			url: "https://staging.tracs.txstate.edu/direct/membership.json",
			method: "get"
		};

		const fetchStart = new Date().getTime();
		fetch(options).then(res => {
				if (res.ok) {
					res.json().then(sites => {
							let siteIds = sites.membership_collection.map((site) => {
								let parsedId = site.id.split(':');
								return parsedId[parsedId.length - 1];
							});

							Storage.sites.get()
								.then(data => getAllSites(siteIds, data))
								.catch(error => getAllSites(siteIds));
						}
					);
				}
			}
		)
		;
	}
}
