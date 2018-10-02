import React, { PureComponent } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { withNavigation } from 'react-navigation'
import styled from 'styled-components'

const Container = styled.View`
  align-items: center;
  justify-content: center;
`

const checkTools = (existingTools, currentScreen) => {
  switch (currentScreen) {
    case 'Forums':
      return Array.isArray(existingTools) && existingTools.includes('sakai.forums')
    case 'Announcements':
      return Array.isArray(existingTools) && existingTools.includes('sakai.announcements')
    case 'Attendance':
      return Array.isArray(existingTools) && existingTools.includes('sakai.attendance')
    case 'Resources':
      return Array.isArray(existingTools) && existingTools.includes('sakai.resources')
    case 'Grades':
      return true
    default:
      break
  }
}

class TabBarButton extends PureComponent {
  onPress = (hasTool) => () => {
    const { onPress } = this.props
    if (hasTool) {
      onPress && onPress()
    }
  }

  render () {
    const { children, navigation, screen } = this.props
    const course = navigation.getParam('course', null)
    const tools = Object.keys(course.tools)
    const hasTool = checkTools(tools, screen)
    const activeTintColor = hasTool ? '#3A6B86' : '#80808080'
    const inactiveTintColor = activeTintColor
    const tintColor = activeTintColor

    return (
      <TouchableWithoutFeedback onPress={this.onPress(hasTool)}>
        <Container>
          {React.Children.map(children, child => React.cloneElement(child, { inactiveTintColor, activeTintColor, tintColor }))}
        </Container>
      </TouchableWithoutFeedback>
    )
  }
}

export default withNavigation(TabBarButton)
