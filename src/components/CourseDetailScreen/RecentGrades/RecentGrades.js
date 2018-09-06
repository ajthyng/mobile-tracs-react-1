import React, {PureComponent} from 'react'
import RecentGrade from './RecentGrade'
import styled from 'styled-components'

const RecentGradesContainer = styled.View`
  margin: 4px 15px 15px 15px;
  align-self: stretch;
  background-color: ${props => props.theme.viewBackground};
  border-radius: 3px;
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

class RecentGrades extends PureComponent {
  render () {
    const {grades} = this.props

    return (
      <RecentGradesContainer>
        {grades.slice(0, 2).map(renderGrades)}
      </RecentGradesContainer>
    )
  }
}

RecentGrades.defaultProps = {
  grades: []
}

RecentGrades.displayName = 'RecentGrades'

export default RecentGrades
