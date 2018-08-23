import React, {Component} from 'react'
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

const AnnouncementsList = styled.FlatList`
  width: 100%;
`

class AnnouncementsScreen extends Component {
  state = {
    silentLoad: false,
    refreshing: false
  }

  componentDidMount () {
    this.props.getAnnouncements()
    Subject.subscribe('notification', this.loadAnnouncements)
  }

  componentWillUnmount () {
    Subject.unsubscribe('notification', this.loadAnnouncements)
  }

  componentDidUpdate (prevProps) {
    if (prevProps.loading && !this.props.loading) {
      this.setState({silentLoad: false, refreshing: false})
      this.markAsSeen()
    }
  }

  markAsSeen = () => {
    const announcements = this.props.announcementNotifications
    const ids = announcements.reduce((accum, announcement) => {
      if (!announcement.seen) accum.push(announcement.id)
      return accum
    }, [])

    if (ids.length > 0) {
      this.props.batchUpdate(ids, {seen: true})
    }
  }

  refreshAnnouncements = () => {
    this.setState({silentLoad: true, refreshing: true})
    this.props.getAnnouncements()
  }

  loadAnnouncements = () => {
    this.setState({silentLoad: true})
    this.props.getAnnouncements()
  }

  renderAnnouncement = ({item}) => {
    const { announcementNotifications, theme } = this.props
    const unreadAnnouncements = announcementNotifications
      .filter(({read}) => !read).map(({keys}) => keys.object_id).filter(id => id !== null)

    const unread = unreadAnnouncements.contains(item.announcementId)
    const notification = announcementNotifications.find(({keys}) => keys.object_id === item.announcementId)

    return (
      <Announcement
        theme={theme}
        announcement={item}
        unread={unread}
        notification={notification}
      />
    )
  }

  render () {
    const {announcements, loading} = this.props
    const {refreshing, silentLoad} = this.state

    return loading && !silentLoad ? (<ActivityIndicator />) : (
      <Container>
        <AnnouncementsList
          data={announcements}
          refreshing={refreshing}
          onRefresh={this.refreshAnnouncements}
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

  const announcementNotifications = state.notifications.announcements
  announcements = state.announcements.all.filter(item => item.siteId === id).reverse()

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
