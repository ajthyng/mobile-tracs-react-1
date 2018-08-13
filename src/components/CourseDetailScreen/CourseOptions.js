import React, {Component} from 'react'
import styled from 'styled-components'
import CourseOption from './CourseOption'
import Entypo from 'react-native-vector-icons/Entypo'
import {NavigationActions, withNavigation} from 'react-navigation'

const Container = styled.View`
  flex: 1;
  width: 100%;
`

const Row = styled.View`
  justify-content: center;
  flex-direction: row;
`

class CourseOptions extends Component {
  constructor(props) {
    super(props)
  }

  goToGradebook = () => {
    const {course, navigation} = this.props
    const openGradebook = NavigationActions.navigate({
      routeName: 'Gradebook',
      params: {course}
    })
    navigation.dispatch(openGradebook)
  }

  goToWeb = () => {
    const {course: {id: siteId}, navigation} = this.props

    const url = `${global.urls.baseUrl}${global.urls.webUrl}/${siteId}`
    const mainSite = `${global.urls.baseUrl}${global.urls.portal}`
    const openWebView = NavigationActions.navigate({
      routeName: 'TRACSWeb',
      params: {baseUrl: siteId ? url : mainSite, transition: 'cardFromRight'}
    })
    navigation.dispatch(openWebView)
  }

  goToForums = () => {
    //TODO: Send them to forums screen
  }

  goToAnnouncements = () => {
    const {course, navigation: {navigate}} = this.props
    navigate('Announcements', {
      transition: 'cardFromRight',
      course
    })
  }

  render() {
    return (
      <Container>
        <Row>
          <CourseOption label='Gradebook' name='book' onClick={this.goToGradebook} />
          <CourseOption Icon={Entypo} label='Course Website' name='browser' onClick={this.goToWeb} />
        </Row>
        <Row>
          <CourseOption label='Forum Posts' name='comments-o' />
          <CourseOption label='Announcements' name='bullhorn' onClick={this.goToAnnouncements} />
        </Row>
      </Container>
    )
  }
}

export default withNavigation(CourseOptions)