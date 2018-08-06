//import env from './env.json';

const devBaseUrl = "http://ajt79.its.txstate.edu:8080"
const stagingBaseUrl = "https://staging.tracs.txstate.edu"
const prodBaseUrl = "https://tracs.txstate.edu"
const dispatchQualUrl = "https://dispatchqa1.its.qual.txstate.edu"
const dispatchProdUrl = "https://dispatch.its.txstate.edu"
const feedbackUrl = "https://txstate.co1.qualtrics.com/jfe/form/SV_exO0EYONZuNkKmp"
const supportUrl = "https://txstate.co1.qualtrics.com/jfe/form/SV_0B2IRTJVBxGjiDP"

const endpoints = {
  session: "/direct/session/current.json",
  membership: "/direct/membership.json",
  portal: "/portal",
  login: "/direct/session",
  logout: "/portal/logout",
  jwt: ":3000/token.pl",
  registrationBase: "/registrations",
  webUrl: '/portal/site',
  favorites: '/portal/favorites/list',
  allAnnouncements: '/direct/announcement/all.json',
  grades: '/direct/gradebook/my.json',
  profile (netid) {
    return `/direct/profile/${netid}.json`
  },
  profileImage (netid) {
    return `/direct/profile/${netid}/image.jpeg`
  },
  sites (limit, start) {
    return `/direct/site.json?withPerms=site.visit&_limit=${limit}&_start=${start}`
  },
  getForumPage (siteID, toolPageID) {
    return `/${siteID}/tool-reset/${toolPageID}`
  },
  getAnnouncementPage (siteID, toolPageId) {
    return `/${siteID}/tool-reset/${toolPageId}`
  },
  registration (jwt) {
    return `${this.registrationBase}?jwt=${jwt}`
  },
  getRegistration (token) {
    return `${this.registrationBase}/${token}`
  },
  getNotifications (token) {
    return `/notifications?token=${token}`
  },
  updateNotification (token, notification) {
    return `/notifications/${notification.id}?token=${token}`
  },
  site (siteid) {
    return `/direct/site/${siteid}.json`
  },
  tools (siteid) {
    return `/direct/site/${siteid}/pages.json`
  },
  settings (token) {
    return `/settings/${token}`
  },
  announcement (siteID, msgID) {
    return `/direct/announcement/message/${siteID}/${msgID}.json`
  },
  forumMessage (forumID) {
    return `/direct${forumID}.json`
  },
  forumTopic (forumID) {
    let topicUrl = forumID.split('/')
    topicUrl.splice(topicUrl.length - 2, 2)
    return `/direct/${topicUrl.join('/')}.json`
  },
  forumUrl (siteId) {
    return `/direct/forums/site/${siteId}.json`
  }
}

let urls = {
  baseUrl: prodBaseUrl,
  dispatchUrl: dispatchProdUrl,
  feedback: feedbackUrl,
  support: supportUrl,
  ...endpoints
}

if (__DEV__) {
  urls = {
    baseUrl: devBaseUrl,
    dispatchUrl: dispatchQualUrl,
    feedback: feedbackUrl,
    support: supportUrl,
    ...endpoints
  }
}

module.exports = {
  ...urls
}