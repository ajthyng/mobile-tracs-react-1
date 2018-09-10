import React, {Component} from 'react'
import styled, {withTheme} from 'styled-components'
import {RefreshControl} from 'react-native'
import {connect} from 'react-redux'
import {getAnnouncements} from '../../actions/announcements'
import {batchUpdateNotification} from '../../actions/notifications'
import {withNavigation, NavigationActions} from 'react-navigation'
import ActivityIndicator from '../ActivityIndicator'
import Announcement from './Announcement'
import Subject from '../../utils/subject'
import Header from './AnnouncementsHeader'
import Footer from './AnnouncementsFooter'
import EmptyAnnouncements from './EmptyAnnouncements'

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.viewBackground};
`

const Announcements = styled.ScrollView`
  background-color: rgb(234, 234, 234);
  align-self: stretch;
`

const AnnouncementsContainer = styled.View`
  margin: 5px;
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

  renderAnnouncement = (item) => {
    const { announcementNotifications, theme } = this.props
    const unreadAnnouncements = announcementNotifications
      .filter(({read}) => !read).map(({keys}) => keys.object_id).filter(id => id !== null)

    const unread = unreadAnnouncements.includes(item.announcementId)
    const notification = announcementNotifications.find(({keys}) => keys.object_id === item.announcementId)

    return (
      <Announcement
        key={item.announcementId}
        theme={theme}
        announcement={item}
        unread={unread}
        notification={notification}
      />
    )
  }

  goToWeb = () => {
    const {id: siteId, tools} = this.props.navigation && this.props.navigation.getParam('course', {id: null, tools: []})
    const {navigation} = this.props

    const url = `${global.urls.baseUrl}${global.urls.webUrl}/${siteId}/tool-reset/${tools['sakai.announcements'].id}`
    const mainSite = `${global.urls.baseUrl}${global.urls.portal}`

    const openWebView = NavigationActions.navigate({
      routeName: 'TRACSWeb',
      params: {baseUrl: siteId ? url : mainSite, transition: 'cardFromRight'}
    })
    navigation.dispatch(openWebView)
  }

  render () {
    const {announcements, loading} = this.props
    const {refreshing, silentLoad} = this.state
    const course = this.props.navigation && this.props.navigation.getParam('course', {})
    const announcementList = announcements.map(this.renderAnnouncement)

    return loading && !silentLoad ? (<ActivityIndicator />) : (
      <Container>
        <Header title={course.name} />
        <Announcements
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.refreshAnnouncements} />}
          contentContainerStyle={{backgroundColor: 'rgb(234, 234, 234)'}}
        >
          <AnnouncementsContainer>
            {announcementList.length > 0 ? announcementList : <EmptyAnnouncements />}
          </AnnouncementsContainer>
          <Footer onPress={this.goToWeb} />
        </Announcements>
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
