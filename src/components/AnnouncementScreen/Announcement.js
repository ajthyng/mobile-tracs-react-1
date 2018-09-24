import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { batchUpdateNotification } from '../../actions/notifications'
import { TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import HTMLView from 'react-native-htmlview'
import dayjs from 'dayjs'

const Container = styled.View`
  background-color: ${props => props.theme.announcementBackground}; 
  margin: 5px;
`

const Body = styled(HTMLView)`
  background-color: ${props => props.theme.announcementBackground};
  overflow: hidden;
  width: ${props => props.width}px;
  ${props => props.showBody ? '' : 'height: 0;'}
  ${props => props.showBody ? 'opacity: 1;' : 'opacity: 0;'}
  ${props => props.showBody ? 'padding: 10px;' : 'padding: 0;'}
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
    showBody: false,
    width: Dimensions.get('window').width - 30
  }

  updateWidth = ({ window: { width } }) => {
    this.setState({ width: width - 30 })
  }

  componentDidMount () {
    Dimensions.addEventListener('change', this.updateWidth)
  }

  componentWillUnmount () {
    Dimensions.addEventListener('change', this.updateWidth)
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
    const { showBody, width } = this.state
    const posted = dayjs(createdOn).format('MMMM D hh:mma')

    return (
      <Container>
        <TitleContainer activeOpacity={1} onPress={this.onPress}>
          <Title numberOfLines={1} ellipsizeMode='tail' unread={unread}>{title}</Title>
          <Posted>{posted}</Posted>
        </TitleContainer>
        <ScrollView horizontal>
          <Body
            showBody={showBody}
            value={body}
            width={width}
          />
        </ScrollView>
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
