import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { batchUpdateNotification } from '../../actions/notifications'
import { TouchableOpacity } from 'react-native'
import HTMLView from 'react-native-htmlview'
import dayjs from 'dayjs'

const Container = styled.View`
  background-color: ${props => props.theme.announcementBackground}; 
  margin: 5px;
`

const Body = styled(HTMLView)`
  background-color: ${props => props.theme.announcementBackground};
  overflow: hidden;
  ${props => props.showBody ? '' : 'height: 0;'}
  ${props => props.showBody ? 'opacity: 1;' : 'opacity: 0;'}
  ${props => props.showBody ? 'padding: 15px;' : 'padding: 0;'}
`

const TitleContainer = styled(TouchableOpacity)`
  align-items: flex-start;
  justify-content: center;
  padding: 16px 24px 16px 10px;
  align-self: stretch;
  background-color: ${props => props.theme.announcementBackground};
`

const Title = styled.Text`
  font-weight: ${props => props.unread ? 'bold' : '400'};
  text-decoration: ${props => props.unread ? 'underline' : 'none'};
  font-size: 20px;
  color: ${props => props.theme.darkText};
`

const Posted = styled.Text`
  font-weight: 400;
  font-size: 12px;
  color: ${props => props.theme.darkText};
`

class Announcement extends PureComponent {
state = {
  showBody: false
}
webView = React.createRef()

updateHeight = event => {
  const { title } = event
  this.setState({ height: Number(title) })
}

onPress = () => {
  const { notification } = this.props

  this.setState(prev => ({ showBody: !prev.showBody }), () => {
    if (notification && !notification.read && this.state.showBody) {
      this.props.markAsRead(notification.id, { read: true })
    }
  })
}

render () {
  const { announcement: { title, body, createdOn }, unread } = this.props
  const { showBody } = this.state
  const posted = dayjs(createdOn).format('MMMM D hh:mma')

  return (
    <Container>
      <TitleContainer activeOpacity={1} onPress={this.onPress}>
        <Title numberOfLines={1} ellipsizeMode='tail' unread={unread}>{title}</Title>
        <Posted>{posted}</Posted>
      </TitleContainer>
      <Body
        showBody={showBody}
        value={body}
      />
    </Container>
  )
}
}

Announcement.defaultProps = {
  unread: false
}

const mapDispatchToProps = dispatch => ({
  markAsRead: (id) => dispatch(batchUpdateNotification([id], { read: true }))
})

export default connect(null, mapDispatchToProps)(Announcement)
