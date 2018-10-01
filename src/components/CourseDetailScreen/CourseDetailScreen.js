import React, { PureComponent } from 'react'
import styled, { withTheme } from 'styled-components'
import { Platform } from 'react-native'
import CourseDetailHeader from './CourseDetailHeader'
import CourseOptions from './CourseOptions'
import RecentGrades from './RecentGrades/RecentGrades'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'

const Container = styled.View`
  flex: 1;
  align-self: stretch;
  align-items: center;
  justify-content: flex-start;
  background-color: ${props => props.theme.viewBackground};
`

const Content = styled.ScrollView`
  align-self: stretch;
  background-color: rgb(234, 234, 234);
`

const Header = styled(CourseDetailHeader)`
  background-color: ${props => props.theme.gradeSummaryBackground};
`

const RecentGradesSection = styled.View`
  align-self: stretch;
  align-items: flex-start;
  border-radius: 3px;
  background-color: rgb(234, 234, 234);
`

const Title = styled.Text`
  font-size: ${global.ios ? '13' : '11'}px;
  margin: 15px 0 5px 15px;
  font-variant: small-caps;
  color: ${props => props.theme.darkText};
  background-color: rgb(234, 234, 234);
`

const OptionsSection = styled.View`
  flex: 1;
  align-self: stretch;
  justify-content: flex-end;
  background-color: ${props => props.theme.viewBackground};
`

class CourseDetailScreen extends PureComponent {
  constructor (props) {
    super(props)
    const title = 'recently posted grades'
    this.title = Platform.select({
      ios: title,
      android: title.toUpperCase()
    })
  }

  goToGradebook = () => {
    const { course, navigation } = this.props
    const openGradebook = NavigationActions.navigate({
      routeName: 'Gradebook',
      params: { course, transition: 'cardFromRight' }
    })
    navigation.dispatch(openGradebook)
  }

  goToCourse = () => {
    const { course: { id: siteId }, navigation } = this.props

    const url = `${global.urls.baseUrl}${global.urls.webUrl}/${siteId}`
    const mainSite = `${global.urls.baseUrl}${global.urls.portal}`
    const openWebView = NavigationActions.navigate({
      routeName: 'TRACSWeb',
      params: { baseUrl: siteId ? url : mainSite, transition: 'cardFromRight' }
    })
    navigation.dispatch(openWebView)
  }

  render () {
    const { course, grades } = this.props
    const { contactInfo: { email: facultyEmail }, name: title, isFavorite } = course
    const updateFavorites = this.props.navigation.getParam('updateFavorites', () => null)

    return (
      <Container>
        <Header
          navigation={this.props.navigation}
          title={title}
          email={facultyEmail}
          onPress={this.goToCourse}
          isFavorite={isFavorite}
          updateFavorites={updateFavorites}
        />
        <Content
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between'
          }}
        >
          <RecentGradesSection>
            <Title>{this.title}</Title>
            <RecentGrades grades={grades} goToGradebook={this.goToGradebook} />
          </RecentGradesSection>
          {/* <OptionsSection>
            <CourseOptions course={course} />
          </OptionsSection> */}
        </Content>
      </Container>
    )
  }
}

CourseDetailScreen.defaultProps = {
  course: {
    id: '',
    name: 'Course title not set',
    contactInfo: {
      name: 'Instructor name not found',
      email: 'tracs@txstate.edu'
    }
  }
}

CourseDetailScreen.navigationProps = {
  title: 'Course'
}

const byPostedDate = (a, b) => {
  const postedA = a.postedDate
  const postedB = b.postedDate

  if (postedA > postedB) return -1 // Later time stamps go to the top of the list
  if (postedA < postedB) return 1 // Earlier time stamps go to the bottom
  return 0 // Times are equal or undefined
}

export const mapStateToProps = (state, props) => {
  const course = props.navigation && props.navigation.getParam('course', null)
  const siteId = course.id || null
  let grades = state?.grades?.[siteId]?.grades || []

  if (!Array.isArray(grades)) { grades = [] }

  let filteredGrades = grades
    .filter(({ postedDate, grade }) => postedDate !== null && grade !== null)
    .sort(byPostedDate)

  if (filteredGrades.length === 0) {
    filteredGrades = grades.filter(({ grade }) => grade !== null).reverse()
  } else if (filteredGrades.length === 1) {
    filteredGrades = [...filteredGrades, ...grades.filter(({ grade, postedDate }) => grade !== null && postedDate === null).reverse()]
  }

  return {
    course,
    grades: filteredGrades
  }
}

export default connect(mapStateToProps, null)(withTheme(CourseDetailScreen))
