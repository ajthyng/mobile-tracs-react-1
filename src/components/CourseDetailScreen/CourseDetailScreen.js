import React, {Component} from 'react'
import styled from 'styled-components'
import GradeSummary from '../GradeSummary'
import ScreenHeader from '../ScreenHeader'
import CourseOptionsList from './CourseOptionsList'

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  background-color: darkseagreen;
  width: 100%;
`

const CourseGradeSummary = styled(GradeSummary)`
	background-color: white;
	border-bottom-width: 0px;
`

const CourseDetailHeader = styled(ScreenHeader)`
	background-color: white;
`

const CourseDetailOptions = styled(CourseOptionsList)`
	background-color: white;
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

export default CourseDetailScreen