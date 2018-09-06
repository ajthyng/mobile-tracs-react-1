import React, {Component} from 'react'
import styled from 'styled-components'
import CourseOption from './CourseOption'
import RoundedButton from './RoundedButton'
import {NavigationActions, withNavigation} from 'react-navigation'

const Container = styled.View`
  align-items: center;
  justify-content: center;
  padding-bottom: 16px;
`

const ButtonContainer = styled.View`
  align-self: stretch;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: flex-end;
  padding: 32px 0 32px 0;
`

const CourseSiteButton = styled(RoundedButton)`
  width: 250px;
  height: 50px;
  border-radius: 25px;
`

class CourseOptions extends Component {
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

  goToAttendance = () => {
    const {course, navigation} = this.props

    const siteId = course.id
    const pageId = (course.tools['sakai.attendance'] || {}).pageId
    const mainSite = `${global.urls.baseUrl}${global.urls.portal}`
    const url = `${global.urls.baseUrl}${global.urls.webUrl}/${siteId}/page/${pageId}`

    const openAttendance = NavigationActions.navigate({
      routeName: 'TRACSWeb',
      transition: 'cardFromRight',
      params: {
        baseUrl: pageId ? url : mainSite,
        transition: 'cardFromRight'
      }
    })

    navigation && navigation.dispatch(openAttendance)
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
        <ButtonContainer>
          <CourseOption label='Announcements' name='bullhorn' onClick={this.goToAnnouncements} />
          <CourseOption label='Forum Posts' name='comments' onClick={this.goToForums} />
          <CourseOption label='Attendance' name='check-square' onClick={this.goToAttendance} />
        </ButtonContainer>
        <CourseSiteButton title='Course Site' onPress={this.goToWeb} />
      </Container>
    )
  }
}

export default withNavigation(CourseOptions)
