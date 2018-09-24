import { mapStateToProps } from './AnnouncementsScreen'

const makeAnnouncement = (properties) => {
  return {
    announcementId: 'edeff5f7-d458-4265-a99e-1fbee7cbc032',
    attachments: [],
    body: 'There is a study guide posted under resources.',
    channel: 'main',
    createdByDisplayName: 'Andrew Thyng',
    createdOn: 1535045338273,
    id: 'a7d3fdcf-523b-4e06-b3bb-749824286050:main:edeff5f7-d458-4265-a99e-1fbee7cbc032',
    siteId: 'a7d3fdcf-523b-4e06-b3bb-749824286050',
    siteTitle: 'CHEM2142',
    title: 'Study guides',
    entityReference: '/announcement/a7d3fdcf-523b-4e06-b3bb-749824286050:main:edeff5f7-d458-4265-a99e-1fbee7cbc032',
    entityURL: 'https://staging.tracs.txstate.edu:443/direct/announcement/a7d3fdcf-523b-4e06-b3bb-749824286050:main:edeff5f7-d458-4265-a99e-1fbee7cbc032',
    entityId: 'a7d3fdcf-523b-4e06-b3bb-749824286050:main:edeff5f7-d458-4265-a99e-1fbee7cbc032',
    entityTitle: 'Study guides',
    ...properties
  }
}

describe('state transform tests', () => {
  it('should show empty announcements if course id is null', () => {
    const state = {
      announcements: {
        all: [1, 2, 3, 4],
        isLoading: false,
        errorMessage: ''
      },
      notifications: {
        isBatchUpdating: false,
        announcements: [1, 2, 3, 4]
      }
    }

    const props = {
      navigation: {
        getParam: (key, _) => ({ id: null })
      }
    }

    const receivedState = mapStateToProps(state, props)

    expect(receivedState).toEqual({
      announcements: [],
      announcementNotifications: [1, 2, 3, 4],
      loading: false,
      isBatchUpdating: false,
      notificationErrorMessage: ''
    })
  })

  it('should return empty announcements if navigation is missing', () => {
    const state = {
      announcements: {
        all: [1, 2, 3, 4],
        isLoading: false,
        errorMessage: ''
      },
      notifications: {
        isBatchUpdating: false,
        announcements: [1, 2, 3, 4]
      }
    }

    const props = {}

    const receivedState = mapStateToProps(state, props)

    expect(receivedState).toEqual({
      announcements: [],
      announcementNotifications: state.notifications.announcements,
      loading: false,
      isBatchUpdating: false,
      notificationErrorMessage: ''
    })
  })

  it('should order announcements by first received', () => {
    const first = makeAnnouncement({ createdOn: new Date('2018-03-06').valueOf() })
    const second = makeAnnouncement({ createdOn: new Date('2018-03-05').valueOf() })
    const third = makeAnnouncement({ createdOn: new Date('2018-03-04').valueOf() })

    const state = {
      announcements: {
        all: [second, third, first],
        isLoading: false,
        errorMessage: ''
      },
      notifications: {
        isBatchUpdating: false,
        announcements: []
      }
    }
    const props = {
      navigation: {
        getParam: () => ({ id: 'a7d3fdcf-523b-4e06-b3bb-749824286050' })
      }
    }

    const receivedState = mapStateToProps(state, props)

    expect(receivedState).toEqual({
      announcements: [first, second, third],
      announcementNotifications: state.notifications.announcements,
      loading: false,
      isBatchUpdating: false,
      notificationErrorMessage: ''
    })
  })
})
