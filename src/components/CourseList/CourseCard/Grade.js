import React, { PureComponent } from 'react'
import styled from 'styled-components'

const Container = styled.View`
  align-items: center;
  justify-content: center;
  width: 95px;
  border-right-width: 1px;
  borderRightColor: #80808030;
`

const LetterGrade = styled.Text`
  font-size: 18px;
`

const PercentGrade = styled.Text`
  font-size: 16px;
`

const NoGrade = styled.Text`
  font-size: 10px;
  color: #80808080;
  text-align: center;
`

class Grade extends PureComponent {
  render () {
    const { letterGrade, percentGrade } = this.props
    const gradePercent = percentGrade ? Math.trunc(parseFloat(percentGrade) * 100) / 100 : null

    return (letterGrade && percentGrade) ? (
      <Container accessible accessibilityLabel={`final grade ${gradePercent}%, letter grade ${letterGrade.toUpperCase()}`}>
        <LetterGrade>{letterGrade}</LetterGrade>
        <PercentGrade>{gradePercent}</PercentGrade>
      </Container>
    ) : (
      <Container accessibilityRole='text' accessible accessibilityLabel='No final grade posted'>
        <NoGrade>NO FINAL{'\n'}GRADE POSTED</NoGrade>
      </Container>
    )
  }
}

export default Grade
