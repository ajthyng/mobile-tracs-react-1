import React, {PureComponent} from 'react'
import {ActivityIndicator} from 'react-native'
import {connect} from 'react-redux'
import RecentGrade from './RecentGrade'
import styled from 'styled-components'
import RoundedButton from '../RoundedButton'

const RecentGradesContainer = styled.View`
  margin: 4px 15px 15px 15px;
  align-self: stretch;
  background-color: ${props => props.theme.viewBackground};
  border-radius: 3px;
`

const GradebookButton = styled(RoundedButton)`
  width: 250px;
  height: 40px;
  border-radius: 20px;
  align-self: center;
  margin: 8px;
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

const NoGradeContainer = styled.View`
  background-color: ${props => props.theme.viewBackground};
  align-items: center;
  justify-content: center;
  height: 150px;
`

const NoGradeText = styled.Text`
  color: ${props => props.theme.darkText};
  font-size: 18px;
  text-align: center;
`

const SpinContainer = styled.View`
  height: 150px;
  align-self: stretch;
  justify-content: center;
`

const NoGrades = () => (
  <NoGradeContainer>
    <NoGradeText>NO GRADES{'\n'}HAVE BEEN POSTED</NoGradeText>
  </NoGradeContainer>
)

class RecentGrades extends PureComponent {
  goToGradebook = () => {
    this.props.goToGradebook && this.props.goToGradebook()
  }
  render () {
    const {grades, loading} = this.props
    const hasGrades = grades.length > 0

    let content = null
    if (loading && !hasGrades) {
      content = (<SpinContainer><ActivityIndicator size='large' /></SpinContainer>)
    } else if (hasGrades) {
      content = grades.slice(0, 3).map(renderGrades)
    } else {
      content = <NoGrades />
    }
    return (
      <RecentGradesContainer>
        {content}
        <GradebookButton title='All Grades' onPress={this.goToGradebook} />
      </RecentGradesContainer>
    )
  }
}

RecentGrades.defaultProps = {
  grades: []
}

RecentGrades.displayName = 'RecentGrades'

const mapStateToProps = state => ({
  loading: state.grades.isLoading
})

export default connect(mapStateToProps, null)(RecentGrades)
