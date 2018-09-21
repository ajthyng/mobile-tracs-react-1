import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components'
import dayjs from 'dayjs'

const Touchable = ({ children, onPress }) => <TouchableOpacity onPress={onPress} activeOpacity={0.5} >{children}</TouchableOpacity>

const Container = styled.View`
  margin: 5px;
  background-color: ${props => props.theme.viewBackground};
`

const TitleContainer = styled.View`
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

class Forum extends Component {
  onPress = (id, unread) => () => {
    this.props.onPress && this.props.onPress(id, unread)
  }

  render () {
    const { notification } = this.props
    const { title, createdOn } = (notification.tracs_data || {})
    const unread = !notification.read

    const posted = dayjs(createdOn).format('MMMM D h:mma')
    return (
      <Touchable onPress={this.onPress(notification.id, unread)} >
        <Container>
          <TitleContainer>
            <Title unread={unread}>{title}</Title>
            <Posted>{posted}</Posted>
          </TitleContainer>
        </Container>
      </Touchable>
    )
  }
}

Forum.defaultProps = {
  title: ''
}

export default Forum
