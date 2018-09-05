import React, {Component} from 'react'
import RecentGrade from './RecentGrade'
import styled from 'styled-components'

const RecentGradesContainer = styled.View`
  padding: 0 0 0 0;
  background-color: ${props => props.theme.transparent};
  height: 80px;
  width: 100%;
`
const renderGrades = (gradeItem, index) => {
  const {itemName, grade, points, postedDate, comment} = gradeItem
  return (
    <RecentGrade
      key={index.toString(10)}
      name={itemName}
      grade={grade}
      points={points}
      postedDate={postedDate}
      comment={comment}
    />
  )
}

class RecentGrades extends Component {
  render () {
    const {grades} = this.props

    return (
      <RecentGradesContainer>
        {grades.slice(0, 3).map(renderGrades)}
      </RecentGradesContainer>
    )
  }
}

RecentGrades.defaultProps = {
  grades: []
}

RecentGrades.displayName = 'RecentGrades'

export default RecentGrades
