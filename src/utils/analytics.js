/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import firebase from 'react-native-firebase';
import moment from 'moment';
import {types as siteTypes} from '../constants/sites';

const analytics = firebase.analytics();
const events = {
	COURSE_OPEN: 'CourseOpen',
	PROJECT_OPEN: 'ProjectOpen',
	DASHBOARD_OPEN: 'DashboardOpen',
	TRACS_WEB_OPEN: 'TracsWebOpen',
	FORUMS_OPEN: 'ForumsOpen',
	ANNOUNCEMENTS_OPEN: 'AnnouncementsOpen',
	APP_START: 'AppStart',
	NOTIFICATION_LOAD_TIME: 'NotificationLoadTime',
	SITE_LOAD_TIME: 'SiteLoadTime'
};
const properties = {
	COURSES: 'courses',
	PROJECTS: 'projects',
};

analytics.setAnalyticsCollectionEnabled(true);

let store = null;

const logEvent = (event, params = {}) => {
	let eventParams = {
		...params,
		time: moment().format()
	};
	analytics.logEvent(event, eventParams);
};

const setUserProperty = (name = null, value = null) => {
	if (name === null && value === null) return;
	analytics.setUserProperty(name, value);
};

const methods = (reduxStore) => {
	if (store === null) {
		store = reduxStore;
	}
	return {
		setScreen: (name = null, className = null) => {
			if (name === null && className === null) return;
			analytics.setCurrentScreen(name, className);
		},
		setUserId: () => {
			const id = store.getState().login.tracsID;
			if (/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.test(id)) {
				analytics.setUserId(id);
			}
		},
		logSiteClick: (type, id) => {
			let params = {
				time: moment().format(),
				siteId: id
			};
			let eventName = type === siteTypes.COURSE ? events.COURSE_OPEN : events.PROJECT_OPEN;
			analytics.logEvent(eventName, params);
		},
		logDashboardOpen: () => {
			logEvent(events.DASHBOARD_OPEN)
		},
		logForumsOpen: () => {
			logEvent(events.FORUMS_OPEN);
		},
		logAnnouncementsOpen: () => {
			logEvent(events.ANNOUNCEMENTS_OPEN);
		},
		logTracsWebOpen: () => {
			logEvent(events.TRACS_WEB_OPEN);
		},
		logAppStart: () => {
			logEvent(events.APP_START);
		},
		logNotificationLoadTime: (time) => {
			let notifications = store.getState().notifications;
			let notificationCount = notifications.announcements.length + notifications.forums.length;
			logEvent(events.NOTIFICATION_LOAD_TIME, {
				loadTime: time,
				notificationCount: notificationCount
			});
		},
		logSiteLoadTime: (time) => {
			logEvent(events.SITE_LOAD_TIME, {
				loadTime: time,
				siteCount: Object.keys(store.getState().tracsSites.userSites).length
			});
		},
		logSiteCounts: (sites) => {
			let courseCount = 0;
			let projectCount = 0;
			let userSites = Object.values(sites);
			userSites.forEach(site => {
				courseCount += site.type === siteTypes.COURSE ? 1 : 0;
				projectCount += site.type === siteTypes.PROJECT ? 1 : 0;
			});
			setUserProperty(properties.COURSES, courseCount.toString(10));
			setUserProperty(properties.PROJECTS, projectCount.toString(10));
		}
	}
};

export const Analytics = (store) => {
	return methods(store);
};