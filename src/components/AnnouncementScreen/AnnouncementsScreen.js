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
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.getAnnouncements()
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

  render() {
    const {announcements, loading, theme} = this.props
    return loading ? (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator />
      </View>
    ) : (
      <Container>
        <FlatList
          bounces={false}
          data={announcements}
          style={{width: '100%'}}
          contentContainerStyle={null}
          keyExtractor={item => item.announcementId}
          renderItem={({item}) => <Announcement theme={theme} announcement={item} />}
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