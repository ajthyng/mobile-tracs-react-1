import React, {Component} from 'react'
import RecentGrade from './RecentGrade'
import styled from 'styled-components'

const RecentGradesContainer = styled.View`
	flex: 1;
	padding: 0 8px 0 8px;
	background-color: ${props => props.theme.transparent};
	height: 80px;
`

class RecentGrades extends Component {
	constructor(props) {
		super(props)
	}

	renderGrades (gradeItem, index) {
		const {itemName, grade, points, postedDate, comment} = gradeItem
		return (
			<RecentGrade
				key={index.toString(10)}
				name={itemName}
				grade={grade}
				points={points}
				dateGraded={postedDate}
				comment={comment}
			/>
		)
	}

	render() {
		const {grades} = this.props

		return (
			<RecentGradesContainer>
				{grades.map(this.renderGrades)}
			</RecentGradesContainer>
		)
	}
}

RecentGrades.defaultProps = {
	grades: []
}

export default RecentGrades