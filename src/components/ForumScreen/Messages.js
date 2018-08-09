import React, {Component} from 'react'
import {View, ScrollView} from 'react-native'
import styled, {withTheme} from 'styled-components'
import {connect} from 'react-redux'
import {getMessages} from '../../actions/forums'
import Message from './Message'

const Container = styled.View`
  background-color: ${props => props.theme.viewBackground};
  width: 100%;
  ${props => props.open ? '' : 'height: 0px;'}
`

class Messages extends Component {
  componentDidUpdate (prevProps) {
    const {open: currentlyOpen, getMessages, forum, siteId, topic} = this.props
    const wasClosed = !prevProps.open
    if (currentlyOpen && wasClosed) {
      getMessages && getMessages(siteId, forum, topic)
    }
  }

  render() {
    const {messages, open, siteId} = this.props
    return (
      <Container open={open}>
        <ScrollView>
          {messages && messages.map(({title, id}) => <Message title={title} key={siteId + id} />)}
        </ScrollView>
      </Container>
    )
  }
}

const mapStateToProps = (state, {siteId, forum, topic}) => {
  //const messages = state.forums.messages[siteId][forum]
  return {
    loading: state.forums.loadingMessages,
    messages: []
  }
}

const mapDispatchToProps = dispatch => ({
  getMessages: (siteId, forum, topic) => dispatch(getMessages(siteId, forum, topic))
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Messages))