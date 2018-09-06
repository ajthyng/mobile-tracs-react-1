import React, {PureComponent} from 'react'
import styled, {withTheme} from 'styled-components'
import ScreenHeader from '../ScreenHeader'
import CourseOptions from './CourseOptions'
import RecentGrades from './RecentGrades/RecentGrades'
import {connect} from 'react-redux'

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

const CourseDetailHeader = styled(ScreenHeader)`
  background-color: ${props => props.theme.gradeSummaryBackground};
`

const RecentGradesSection = styled.View`
  align-self: stretch;
  align-items: flex-start;
  border-radius: 3px;
  background-color: rgb(234, 234, 234);
`

const Title = styled.Text`
  font-size: 12px;
  margin-left: 15px;
  margin-top: 15px;
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
  render () {
    const {course, grades} = this.props
    const {contactInfo: {email: facultyEmail}, name: title} = course

    return (
      <Container>
        <CourseDetailHeader
          navigation={this.props.navigation}
          title={title}
          email={facultyEmail}
        />
        <Content
          bounces={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between'
          }}
        >
          <RecentGradesSection>
            <Title>RECENTLY POSTED GRADES</Title>
            <RecentGrades grades={grades} />
          </RecentGradesSection>
          <OptionsSection>
            <CourseOptions course={course} />
          </OptionsSection>
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

const mapStateToProps = (state, props) => {
  const course = props.navigation && props.navigation.getParam('course', null)
  const siteId = course.id || null
  let grades = (state.grades[siteId] || {}).grades || []

  grades = grades
    .filter(({postedDate}) => postedDate !== null)
    .sort(byPostedDate)

  return {
    course,
    grades
  }
}

export default connect(mapStateToProps, null)(withTheme(CourseDetailScreen))
