/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {sitesActions} from '../constants/actions';
import {Analytics} from '../utils/analytics';
import {haxios as axios} from '../utils/networking';

let {CLEAR_SITES, REQUEST_SITES, SITES_SUCCESS, SITES_FAILURE} = sitesActions;

export const clearSites = () => {
	return {
		type: CLEAR_SITES,
		userSites: {}
	}
};

const requestSites = () => {
	return {
		type: REQUEST_SITES
	}
};

const sitesSuccess = (userSites, loadTime) => {
	Analytics().logSiteCounts(userSites);
	Analytics().logSiteLoadTime(loadTime);
	console.log(loadTime);
	return {
		type: SITES_SUCCESS,
		userSites: userSites
	}
};

const sitesFailure = (error) => {
	return {
		type: SITES_FAILURE,
		errorMessage: error.message
	}
};

export function getSiteInfo(netid) {
	return async (dispatch) => {
		let startTime = new Date();
		dispatch(requestSites());

		const limit = 500;
		const start = 0;
		const sitesUrl = `${global.urls.baseUrl}${global.urls.sites(limit, start)}`;
		let res = await axios(sitesUrl, {method: 'get'}).catch(err => err);
		if (res instanceof Error) {
			dispatch(sitesFailure(res));
		}

		let sites = (res.data || {}).site_collection;
		let userSites = sites.reduce((accum, site) => {
			accum[site.id] = {
				id: site.id,
				name: site.title,
				contactInfo: {
					name: site.props['contact-name'],
					email: site.props['contact-email']
				},
				tools: Object.keys(site.props || {}).reduce((accum, key) => {
					if (key.indexOf("sakai") >= 0) {
						try {
							accum[key] = JSON.parse(site.props[key] || "{}");
						} catch (err) {}
					}
					return accum;
				}, {}),
				owner: netid,
				type: site.type,
				forumCount: 0,
				unseenCount: 0
			};
			return accum;
		}, {});

		let siteLoadTime = new Date() - startTime;
		dispatch(sitesSuccess(userSites, siteLoadTime));
	}
}
