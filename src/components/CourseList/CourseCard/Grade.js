import React, {PureComponent} from 'react'
import styled from 'styled-components'

const Container = styled.View`
  align-items: center;
  justify-content: center;
  width: 110px;
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

const renderContent = (letter, percent) => {
  if (letter && percent) {
    return (
      <React.Fragment>
        <LetterGrade>{letter}</LetterGrade>
        <PercentGrade>{percent}</PercentGrade>
      </React.Fragment>
    )
  } else {
    return (<NoGrade>NO FINAL{'\n'}GRADE POSTED</NoGrade>)
  }
}

class Grade extends PureComponent {
  render () {
    const {letterGrade, percentGrade} = this.props
    return (
      <Container>
        {renderContent(letterGrade, percentGrade)}
      </Container>
    )
  }
}

export default Grade
