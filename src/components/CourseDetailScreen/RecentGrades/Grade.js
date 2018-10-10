import React, { PureComponent } from 'react'
import styled from 'styled-components'

const Container = styled.View`
  max-width: 95px;
  flex-grow: 1;
  flex-direction: column;
  margin-bottom: ${props => props.hasComment ? 16 : 0}px;
`

const Points = styled.Text`
  font-size: 25px;
  text-align: center;
  color: #363534;
`

const Total = styled.Text`
  text-align: center;
  font-size: 12px;
`

const NoGrade = styled.Text`
  text-align: center;
  font-size: 11px;
  padding: 2px;
`

class Grade extends PureComponent {
  render () {
    const { earned, total, hasComment } = this.props

    return earned === null
      ? (
        <Container>
          <NoGrade>{'NO GRADE\nPOSTED'}</NoGrade>
        </Container>
      )
      : (
        <Container
          accessible
          accessibilityLabel={`${earned} points out of total ${total}`}
          hasComment={hasComment}
        >
          <Points numberOfLines={1}>
            {earned}
          </Points>
          <Total>TOTAL {total}</Total>
        </Container>
      )
  }
}

Grade.defaultProps = {
  earned: null,
  total: null
}

export default Grade
