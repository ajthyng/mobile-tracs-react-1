import React, {Component} from 'react'
import styled, {withTheme} from 'styled-components'
import {TouchableWithoutFeedback} from 'react-native'
import Messages from './Messages'

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.viewBackground};
  width: 100%;
`

const Title = styled.Text`
  align-self: flex-start;
  font-size: 22px;
  padding: 8px 8px 8px 16px;
  color: ${props => props.theme.darkText};
`

class Topic extends Component {
  state = {
    open: false
  }
  render() {
    const {title, siteId, forum, topic} = this.props
    const {open} = this.state

    return (
      <TouchableWithoutFeedback onPress={() => this.setState({open: !open})}>
        <Container>
          <Title>{title}</Title>
          <Messages open={open} siteId={siteId} forum={forum} topic={topic} />
        </Container>
      </TouchableWithoutFeedback>
    )
  }
}

export default withTheme(Topic)