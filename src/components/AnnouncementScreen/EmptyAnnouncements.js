import React, { PureComponent } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components'

const Container = styled.View`
  margin: 5px;
  align-self: stretch;
  background-color: ${props => props.theme.viewBackground};
`

const Message = styled.Text`
  color: ${props => props.theme.darkText};
  opacity: 0.8;
  text-align: center;
  font-variant: small-caps;
  padding: 24px 0;
`

const message = 'no annoucements have been posted'
const messageText = Platform.select({
  ios: message,
  android: message.toUpperCase()
})
const fontSize = Platform.select({
  ios: 17,
  android: 14
})

class EmptyAnnouncements extends PureComponent {
  render () {
    return (
      <Container>
        <Message style={{ fontSize }}>{messageText}</Message>
      </Container>
    )
  }
}

export default EmptyAnnouncements
