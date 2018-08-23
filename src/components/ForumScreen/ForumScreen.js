import React, {Component} from 'react'
import {FlatList, View} from 'react-native'
import styled, {withTheme} from 'styled-components'
import {connect} from 'react-redux'
import ActivityIndicator from '../ActivityIndicator'
import Forum from './Forum'
import {getNotifications, batchUpdateNotification} from '../../actions/notifications'
import Subject from '../../utils/subject'

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: ${props => props.theme.viewBackground};
`

const ForumsList = styled(FlatList)`
  width: 100%;
`

const Spinner = () => (
  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    <ActivityIndicator />
  </View>
)

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
    this.setState({silentLoad: true}, this.props.getNotifications)
  }

  refresh = () => {
    this.setState({silentLoad: true, refreshing: true}, this.props.getNotifications)
  }

  markAsRead = (id) => {
    this.props.batchUpdate([id], {read: true})
  }

  markAsSeen = () => {
    const ids = this.props.forums.reduce((accum, post) => {
      if (!post.seen) accum.push(post.id)
      return accum
    }, [])

    if (ids.length > 0) this.props.batchUpdate(ids, {seen: true})
  }

  componentDidUpdate (prevProps) {
    if (prevProps.loading && !this.props.loading) {
      this.setState({silentLoad: false, refreshing: false})
      this.markAsSeen()
    }
  }

  render () {
    const {forums, loading} = this.props
    const {silentLoad, refreshing} = this.state

    return loading && !silentLoad ? <Spinner /> : (
      <Container>
        <ForumsList
          data={forums}
          refreshing={refreshing}
          onRefresh={this.refresh}
          renderItem={({item}) => <Forum notification={item} onPress={this.markAsRead} />}
          keyExtractor={item => item.id}
        />
      </Container>
    )
  }
}

const mapStateToProps = (state, props) => {
  const {id: siteId} = props.navigation.getParam('course', {id: ''})

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
