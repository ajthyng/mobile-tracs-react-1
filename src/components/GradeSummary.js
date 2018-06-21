import React, {Component} from 'react'
import styled, {withTheme} from 'styled-components'

const Container = styled.View`
  height: 150px;
  background-color: transparent;
  align-items: center;
  justify-content: center;
  width: 100%;
	border-bottom-color: ${props => props.theme.gradeSummaryContainerBorder};
	border-bottom-width: 1px;
`

const TotalGrade = styled.Text`
	font-size: 36px;
	color: ${props => props.theme.darkText};
`

const TotalPoints = styled.Text`
	font-size: 20px;
	color: ${props => props.theme.darkText};
`

const AverageGrade = styled.Text`
	font-size: 24px;
	color: ${props => props.theme.darkText};
`

class GradeSummary extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<Container style={this.props.style}>
				<TotalGrade>75</TotalGrade>
				<TotalPoints>Total: 510/680</TotalPoints>
				<AverageGrade>AVG-Grade</AverageGrade>
			</Container>
		)
	}
}

export default withTheme(GradeSummary)