import React, {Component} from 'react'
import styled from 'styled-components'
import Header from '../CircleHeader/Header'

const Container = styled.View`
  height: 150px;
  background-color: transparent;
  align-items: center;
  justify-content: center;
  width: 100%;
	border-bottom-color: #36353480;
	border-bottom-width: 1px;
`

const TotalGrade = styled.Text`
	font-size: 36px;
	color: #363534;
`

const TotalPoints = styled.Text`
	font-size: 20px;
	color: #363534;
`

const AverageGrade = styled.Text`
	font-size: 24px;
	color: #363534;
`

class GradeSummary extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<Container>
				<TotalGrade>75</TotalGrade>
				<TotalPoints>Total: 510/680</TotalPoints>
				<AverageGrade>AVG-Grade</AverageGrade>
			</Container>
		)
	}
}

export default GradeSummary