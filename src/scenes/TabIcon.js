import React, { PureComponent } from 'react'
import FA5ProIcon from 'react-native-vector-icons/FontAwesome5Pro'
import styled from 'styled-components'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'

const Container = styled.View``

const Dot = styled.View`
  height: 8px;
  width: 8px;
  border-radius: 4px;
  position: absolute;
  top: 3;
  right: -3;
  background-color: #b30e1b;
`

const Icon = styled(FA5ProIcon)`
  color: ${props => props.tintColor};
  font-size: 24px;
  padding-top: 5px;
`

class TabIcon extends PureComponent {
  renderDot = () => {
    const { iconName, newAnnouncements, newForumPosts } = this.props

    switch (iconName) {
      case 'comment':
        return newForumPosts ? <Dot /> : null
      case 'bullhorn':
        return newAnnouncements ? <Dot /> : null
      default:
        return null
    }
  }

  render () {
    const { focused, iconName, tintColor } = this.props

    return (
      <Container>
        <Icon name={iconName} solid={focused} tintColor={tintColor} />
        {this.renderDot()}
      </Container>
    )
  }
}

const mapStateToProps = (state, props) => {
  const course = props.navigation && props.navigation.getParam('course', null)
  const { id = '' } = course
  return {
    newAnnouncements: (state.notifications.badgeCounts[id] || {}).announceCount > 0,
    newForumPosts: (state.notifications.badgeCounts[id] || {}).forumCount > 0
  }
}

export default withNavigation(connect(mapStateToProps, null)(TabIcon))
