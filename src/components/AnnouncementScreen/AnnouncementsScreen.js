import React, {Component} from 'react'
import {
  FlatList,
  View
} from 'react-native'
import styled, {withTheme} from 'styled-components'
import {connect} from 'react-redux'
import {getAnnouncements} from '../../actions/announcements'
import {batchUpdateNotification} from '../../actions/notifications'
import {withNavigation} from 'react-navigation'
import ActivityIndicator from '../ActivityIndicator'
import Announcement from './Announcement'
import Subject from '../../utils/subject'

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.viewBackground};
`

const filterSeen = announcements => announcements
  .filter(({seen}) => !seen)
  .map(({id}) => id)
  .filter(id => id !== null)

class AnnouncementsScreen extends Component {
  componentDidMount() {
    this.props.getAnnouncements()
    Subject.subscribe('notification', this.props.getAnnouncements)
  }

  componentWillUnmount () {
    Subject.unsubscribe('notification', this.props.getAnnouncements)
  }

  componentDidUpdate () {
    const {isBatchUpdating, notificationErrorMessage } = this.props
    if (!isBatchUpdating && !notificationErrorMessage) {
      this.batchUpdateSeen(this.props.announcementNotifications)
    }
  }

  batchUpdateSeen = (announcements = []) => {
    const ids = filterSeen(announcements)
    if (ids.length > 0) {
      this.props.batchUpdate(ids, {seen: true})
    }
  }

  renderAnnouncement = ({item}) => {
    const {announcementNotifications, theme} = this.props
    const unreadAnnouncements = announcementNotifications
      .filter(({read}) => !read).map(({keys: {object_id}}) => object_id).filter(id => id !== null)

    const unread = unreadAnnouncements.contains(item.announcementId)
    const notification = announcementNotifications.find(({keys: {object_id}}) => object_id === item.announcementId)

    return (
      <Announcement
        theme={theme}
        announcement={item}
        unread={unread}
        notification={notification}
      />
    )
  }

  render() {
    const {announcements, loading} = this.props
    return loading ? (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator />
      </View>
    ) : (
      <Container>
        <FlatList
          bounces={false}
          data={announcements.reverse()}
          style={{width: '100%'}}
          contentContainerStyle={null}
          keyExtractor={item => item.announcementId}
          renderItem={this.renderAnnouncement}
        />
      </Container>
    )
  }
}

AnnouncementsScreen.defaultProps = {
  course: {id: null}
}

const mapStateToProps = (state, props) => {
  const {id} = props.navigation.getParam('course', {})

  let announcements = []

  if (id === null || id === undefined) return {announcements}

  const announcementNotifications = state.notifications.announcements
  announcements = state.announcements.all.filter(item => item.siteId === id)

  return {
    announcements,
    announcementNotifications,
    loading: state.announcements.isLoading,
    isBatchUpdating: state.notifications.isBatchUpdating,
    notificationErrorMessage: state.notifications.errorMessage
  }
}

const mapDispatchToProps = dispatch => ({
  getAnnouncements: () => dispatch(getAnnouncements()),
  batchUpdate: (ids, status) => dispatch(batchUpdateNotification(ids, status))
})

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(withTheme(AnnouncementsScreen)))