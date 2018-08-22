import React, {Component} from 'react'
import {TouchableOpacity, TouchableWithoutFeedback} from 'react-native'
import styled from 'styled-components'
import Topics from './Topics'

const Container = styled.View`
  margin: 6px;
  background-color: ${props => props.theme.viewBackground};
  shadow-opacity: 0.5;
  shadow-color: #363534;
  shadow-offset: 0px 2px;
  shadow-radius: 2px;
`

const UnreadIndicator = styled.View`
  height: 10px;
  width: 10px;
  background-color: #501214;
`

const ForumTitleContainer = styled(TouchableOpacity)`
  height: 40px;
  flex-direction: row; 
  align-items: center;
  justify-content: flex-start;
  padding-left: 8px;
  width: 100%;
  background-color: ${props => props.theme.announcementBackground};
`

const ForumTitle = styled.Text`
  font-weight: bold;
  font-size: 18px;
  margin-left: 8px;
  color: ${props => props.theme.darkText};
`

class Forum extends Component {
  render() {
    const {notification} = this.props
    const {title} = (notification.tracs_data || {})
    const unread = !notification.read

    return (
      <Container>
        <ForumTitleContainer>
          {unread ? <UnreadIndicator/> : null}
          <ForumTitle>{title}</ForumTitle>
        </ForumTitleContainer>
      </Container>
    )
  }
}

Forum.defaultProps = {
  title: ''
}

export default Forum