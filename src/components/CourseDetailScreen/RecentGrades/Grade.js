import React, { PureComponent } from 'react'
import styled, { withTheme } from 'styled-components'

const Container = styled.View`
  height: 100%;
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 30%;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 0 0 16px 0;
`

const Points = styled.Text`
  font-size: 28px;
  text-align: center;
  padding-left: 4px;
  color: ${props => props.theme.darkText};
`

const Total = styled.Text`
  text-align: center;
  font-size: 10px;
`

const NoGrade = styled.Text`
  text-align: center;
  font-size: 10px;
`

class Grade extends PureComponent {
  renderContent = () => {
    const { earned, total } = this.props
    if (earned === null) {
      return (<NoGrade>NO GRADE{'\n'}POSTED</NoGrade>)
    } else {
      return (
        <React.Fragment>
          <Points numberOfLines={1}>{earned
          }</Points>
          <Total>TOTAL {total}</Total>
        </React.Fragment>
      )
    }
  }

  render () {
    return (
      <Container>
        {this.renderContent()}
      </Container>
    )
  }
}

Grade.defaultProps = {
  earned: null,
  total: null
}

export default withTheme(Grade)
