const methods = (reduxStore) => {
  return {
    setScreen: () => null,
    setUserId: () => null,
    logSiteClick: () => null,
    logDashboardOpen: () => null,
    logForumsOpen: () => null,
    logAnnouncementsOpen: () => null,
    logTracsWebOpen: () => null,
    logAppStart: () => null,
    logNotificationLoadTime: () => null,
    logSiteLoadTime: () => null,
    logSiteCounts: () => null
  }
}

function Analytics (store) {
  return methods(store)
}

module.exports = {
  Analytics
}
