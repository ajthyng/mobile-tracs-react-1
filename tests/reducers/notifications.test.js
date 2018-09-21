import {notificationActions} from '../../src/constants/actions'
import {types} from '../../src/constants/notifications'
import { initialState, notificationsReducer } from '../../src/reducers/notifications';

const {
  REQUEST_NOTIFICATIONS,
  NOTIFICATIONS_SUCCESS,
  NOTIFICATIONS_FAILURE,
  REQUEST_NOTIFICATION_UPDATE,
  NOTIFICATION_UPDATE_SUCCESS,
  NOTIFICATION_UPDATE_FAILURE,
  REMOVE_NOTIFICATION,
  REQUEST_BATCH_UPDATE,
  BATCH_UPDATE_SUCCESS,
  BATCH_UPDATE_FAILURE
} = notificationActions

const makeAnnouncement = (properties) => ({
  id: `${Math.random() * 10000}`,
  sent: true,
  seen: true,
  read: false,
  cleared: false,
  replaced: false,
  is_update: false,
  errors: false,
  content_hash: "0049598FDB6BFB26E65C3654BD209BEAC70CC3E0",
  send_updates: true,
  notify_after: "2018-09-10T21:28:23Z",
  keys: {
      notification_type: "creation",
      object_id: "1948ac4e-ce50-4033-bda2-02ba6f5970eb",
      object_type: "announcement",
      provider_id: "tracs",
      user_id: "its-cms-testperms5"
  },
  other_keys: {
      site_id: "3be811c1-5b65-4458-b211-002b51c7deeb"
  },
  ...properties
})

const makeForum = (properties) => ({
  id: `${Math.random() * 10000}`,
  sent: true,
  seen: true,
  read: true,
  cleared: false,
  replaced: false,
  is_update: false,
  errors: false,
  content_hash: "BA90FD56E3E9116B1B79BBFFCD39A2025A899EA3",
  send_updates: false,
  notify_after: "2018-09-10T17:19:55Z",
  keys: {
      notification_type: "creation",
      object_id: "/forums/site/a7d3fdcf-523b-4e06-b3bb-749824286050/forum/64398/topic/1887431/message/3058075",
      object_type: "discussion",
      provider_id: "tracs",
      user_id: "its-cms-testperms5"
  },
  other_keys: {
      site_id: "3be811c1-5b65-4458-b211-002b51c7deeb"
  },
  ...properties
})

describe('badge counts', () => {
  it('should display 0 badge count with no notifications', () => {
    const action = {
      type: NOTIFICATIONS_SUCCESS,
      notifications: []
    }

    const result = notificationsReducer(initialState, action)
    const badgeCounts = {}

    expect(result.badgeCounts).toMatchObject(badgeCounts)
  })

  it('should have badgecount of 1 announcement', () => {
    let notifications = [
      makeAnnouncement({seen: false}), 
      makeAnnouncement({seen: true}),
      makeForum({seen: true})
    ]

    const action = {
      type: notificationActions.NOTIFICATIONS_SUCCESS,
      notifications
    }

    const result = notificationsReducer(initialState, action)
    const expectedBadgeCounts = {
      '3be811c1-5b65-4458-b211-002b51c7deeb': {
        unseenCount: 1,
        announceCount: 1
      },
      announceCount: 1
    }

    expect(result.badgeCounts).toMatchObject(expectedBadgeCounts)
  })

  it('should have an unseen count of 4', () => {
    let notifications = [
      makeAnnouncement({seen: false}),
      makeForum({seen: false}),
      makeAnnouncement({seen: false}),
      makeAnnouncement({seen: true}),
      makeForum({seen: false}),
      makeForum({seen: true})
    ]

    const action = {
      type: notificationActions.NOTIFICATIONS_SUCCESS,
      notifications
    }

    const result = notificationsReducer(initialState, action)
    const expectedBadgeCounts = {
      '3be811c1-5b65-4458-b211-002b51c7deeb': {
        unseenCount: 4,
        announceCount: 2,
        forumCount: 2
      },
      announceCount: 2
    }

    expect(result.badgeCounts).toMatchObject(expectedBadgeCounts)
  })
})