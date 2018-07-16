import React, {Component} from 'react'
import styled, {withTheme} from 'styled-components'
import GradeSummary from '../GradeSummary'
import ScreenHeader from '../ScreenHeader'
import CourseOptionsList from './CourseOptionsList'

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  background-color: ${props => props.theme.transparent};
  width: 100%;
`

const CourseGradeSummary = styled(GradeSummary)`
	background-color: ${props => props.theme.gradeSummaryBackground};
	border-bottom-width: 0;
`

const CourseDetailHeader = styled(ScreenHeader)`
	background-color: ${props => props.theme.gradeSummaryBackground};
`

const CourseDetailOptions = styled(CourseOptionsList)`
	background-color: ${props => props.theme.gradeSummaryBackground};
`

class CourseDetailScreen extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		const {navigation} = this.props

		const course = navigation.getParam('course', {
			contactInfo: {
				name: 'Instructor name not found'
			},
			name: 'Course title not set'
		})

		const {contactInfo: {name: courseContactName}, name: title} = course

		return (
			<Container>
				<CourseDetailHeader
					navigation={this.props.navigation}
					title={title}
					subtitle={courseContactName}
				/>
				<CourseGradeSummary />
				<CourseDetailOptions course={course} />
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