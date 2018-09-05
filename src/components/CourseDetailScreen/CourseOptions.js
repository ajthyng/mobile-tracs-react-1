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
  goToGradebook = () => {
    const {course, navigation} = this.props
    const openGradebook = NavigationActions.navigate({
      routeName: 'Gradebook',
      params: {course, transition: 'cardFromRight'}
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
    const {course, navigation} = this.props

    const openForums = NavigationActions.navigate({
      routeName: 'Forums',
      params: {course, transition: 'cardFromRight'}
    })
    navigation.dispatch(openForums)
  }

  goToCalendar = () => {
    const {course, navigation: {navigate}} = this.props

    navigate('Calendar', {
      transition: 'cardFromRight',
      siteId: course.id,
      siteName: course.name
    })
  }

  goToAnnouncements = () => {
    const {course, navigation: {navigate}} = this.props
    navigate('Announcements', {
      transition: 'cardFromRight',
      course
    })
  }

  render () {
    return (
      <Container>
        <CourseOption label='Gradebook' name='book' onClick={this.goToGradebook} />
        <CourseOption Icon={Entypo} label='Course Website' name='browser' onClick={this.goToWeb} />
        <CourseOption label='Forum Posts' name='comments-o' onClick={this.goToForums} />
        <CourseOption label='Announcements' name='bullhorn' onClick={this.goToAnnouncements} />
        <CourseOption label='Calendar' name='calendar' onClick={this.goToCalendar} />
      </Container>
    )
  }
}

export default withNavigation(CourseOptions)
