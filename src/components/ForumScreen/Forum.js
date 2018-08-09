import React, {Component} from 'react'
import {TouchableWithoutFeedback} from 'react-native'
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

const ForumLabel = styled.Text`
  background-color: ${props => props.theme.viewBackground};
  font-size: 22px;
  padding: 10px;
  color: ${props => props.theme.darkText};
`

class Forum extends Component {
  state = {
    open: false
  }

  render() {
    const {title, siteId, forum} = this.props
    const {open} = this.state

    return (
      <TouchableWithoutFeedback onPress={() => this.setState(prev => ({open: !prev.open}))}>
        <Container>
          <ForumLabel>{title}</ForumLabel>
          <Topics open={open} siteId={siteId} forum={forum} />
        </Container>
      </TouchableWithoutFeedback>
    )
  }
}

Forum.defaultProps = {
  title: ''
}

export default Forum