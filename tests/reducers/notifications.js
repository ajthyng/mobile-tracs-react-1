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

describe('badge counts', () => {
  it('should display 0 badge count with no notifications', () => {
    const action = {
      type: NOTIFICATIONS_SUCCESS,
      notifications: {}
    }

    const result = notificationsReducer(initialState, action)
    const badgeCounts = {}

    expect(result.badgeCounts).toMatchObject(badgeCounts)
  })
})