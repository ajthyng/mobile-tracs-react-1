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
		const {title, subtitle} = this.props
		return (
			<Container>
				<CourseDetailHeader navigation={this.props.navigation} title={title} subtitle={subtitle}/>
				<CourseGradeSummary />
				<CourseDetailOptions />
			</Container>
		)
	}
}

CourseDetailScreen.defaultProps = {
	title: 'HS 1403 v2018.10.30',
	subtitle: 'Dr. Carlos Solis'
}

export default withTheme(CourseDetailScreen)