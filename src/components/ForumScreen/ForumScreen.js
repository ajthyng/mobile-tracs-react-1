import React, { Component } from 'react'
import { RefreshControl } from 'react-native'
import styled, { withTheme } from 'styled-components'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import ActivityIndicator from '../ActivityIndicator'
import Forum from './Forum'
import { getNotifications, batchUpdateNotification } from '../../actions/notifications'
import Subject from '../../utils/subject'
import Header from './ForumHeader'
import Footer from './ForumFooter'
import EmptyForums from './EmptyForums'

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.viewBackground};
`

const ForumsList = styled.ScrollView`
  align-self: stretch;
  background-color: rgb(234, 234, 234);
`

const ForumsContainer = styled.View`
  margin: 5px;
`

const Spinner = () => (<ActivityIndicator />)

class ForumScreen extends Component {
  state = {
    silentLoad: false,
    refreshing: false
  }

  componentDidMount () {
    this.props.getNotifications()
    Subject.subscribe('notification', this.silentRefresh)
  }

  componentWillUnmount () {
    Subject.unsubscribe('notification', this.silentRefresh)
  }

  silentRefresh = () => {
    this.setState({ silentLoad: true }, this.props.getNotifications)
  }

  refresh = () => {
    this.setState({ silentLoad: true, refreshing: true }, this.props.getNotifications)
  }

  goToForums = () => {
    const { navigation } = this.props
    const course = navigation && navigation.getParam('course', { id: null, tools: [] })
    const { id: siteId, tools } = course

    const url = `${global.urls.baseUrl}${global.urls.webUrl}/${siteId}/tool-reset/${tools['sakai.forums'].id}`
    const mainSite = `${global.urls.baseUrl}${global.urls.portal}`

    const openWebView = NavigationActions.navigate({
      routeName: 'TRACSWeb',
      params: { course, baseUrl: siteId ? url : mainSite, transition: 'cardFromRight' }
    })
    navigation.dispatch(openWebView)
  }

  onPress = (id, unread) => {
    if (unread) this.props.batchUpdate([id], { read: true })
    this.goToForums()
  }

  markAsSeen = () => {
    const ids = this.props.forums.reduce((accum, post) => {
      if (!post.seen) accum.push(post.id)
      return accum
    }, [])

    if (ids.length > 0) this.props.batchUpdate(ids, { seen: true })
  }

  componentDidUpdate (prevProps) {
    if (prevProps.loading && !this.props.loading) {
      this.setState({ silentLoad: false, refreshing: false })
      this.markAsSeen()
    }
  }

  renderForum = item => <Forum notification={item} onPress={this.onPress} key={item.id} />

  render () {
    const { forums, loading, navigation } = this.props
    const { silentLoad, refreshing } = this.state
    const course = navigation && navigation.getParam('course', {})

    const forumPosts = forums.map(this.renderForum)
    return loading && !silentLoad ? <Spinner /> : (
      <Container>
        <Header title={course.name} onPress={this.goToForums} />
        <ForumsList
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.refresh} />}
        >
          <ForumsContainer>
            {forumPosts.length > 0 ? forumPosts : <EmptyForums />}
          </ForumsContainer>
          <Footer onPress={this.goToForums} />
        </ForumsList>
      </Container>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { id: siteId } = props.navigation.getParam('course', { id: '' })

  const forums = state.notifications.forums.filter(post => {
    return ((post || {}).other_keys || {}).site_id === siteId
  })

  return {
    siteId,
    forums,
    loading: state.notifications.isLoading
  }
}

const mapDispatchToProps = dispatch => ({
  getNotifications: () => dispatch(getNotifications()),
  batchUpdate: (ids, status) => dispatch(batchUpdateNotification(ids, status))
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ForumScreen))
