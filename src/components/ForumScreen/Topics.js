import React, {Component} from 'react'
import {View, ScrollView} from 'react-native'
import styled, {withTheme} from 'styled-components'
import {connect} from 'react-redux'
import {getTopics} from '../../actions/forums'
import Topic from './Topic'

const Container = styled.View`
  background-color: ${props => props.theme.viewBackground};
  width: 100%;
  ${props => props.open ? '' : 'height: 0px;'}
`

const Spinner = () => (
  <View style={{flex: 1, padding: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'tomato'}} />
)

class Topics extends Component {
  componentDidUpdate (prevProps) {
    const {open: currentlyOpen, getTopics, forum, siteId} = this.props
    const wasClosed = !prevProps.open
    if (currentlyOpen && wasClosed) {
      getTopics && getTopics(siteId, forum)
    }
  }

  render() {
    const {topics, open, siteId, forum} = this.props
    return (
      <Container open={open}>
        <ScrollView>
          {topics && topics.map(({title, id}) => {
            return (
              <Topic title={title} key={siteId + id} siteId={siteId} topic={id} forum={forum}/>
            )
          })}
        </ScrollView>
      </Container>
    )
  }
}

const mapStateToProps = (state, {siteId, forum}) => {
  const forums = state.forums.topics[siteId]

  return {
    loading: state.forums.loadingTopics,
    topics: forums ? forums[forum] : []
  }
}

const mapDispatchToProps = dispatch => ({
  getTopics: (siteId, forum) => dispatch(getTopics(siteId, forum))
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Topics))