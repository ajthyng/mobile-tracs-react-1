import React, {Component} from 'react'
import styled, {withTheme} from 'styled-components'
import ScreenHeader from '../ScreenHeader'
import CourseOption from './CourseOption'
import CourseOptions from './CourseOptions'

const Container = styled.View`
  align-items: center;
  justify-content: flex-start;
  display: flex;
  flex: 1;
  background-color: ${props => props.theme.viewBackground};
`

const CourseDetailHeader = styled(ScreenHeader)`
	background-color: ${props => props.theme.gradeSummaryBackground};
`

class CourseDetailScreen extends Component {
  constructor(props) {
    super(props)
    this.course = this.props.navigation.getParam('course', {
      contactInfo: {
        name: 'Instructor name not found'
      },
      name: 'Course title not set'
    })
  }

  render() {
    const {contactInfo: {name: courseContactName}, name: title} = this.course

    return (
      <Container>
        <CourseDetailHeader
          navigation={this.props.navigation}
          title={title}
          subtitle={courseContactName}
        />
        <CourseOptions course={this.course} />
      </Container>
    )
  }
}

CourseDetailScreen.defaultProps = {
  course: {
    id: '',
    name: 'Course title not set',
    contactInfo: {
      name: 'Instructor name not found'
    }
  }
}

CourseDetailScreen.navigationProps = {
  title: 'Course Info'
}

export default withTheme(CourseDetailScreen)