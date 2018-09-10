import React, {PureComponent} from 'react'
import styled from 'styled-components'

const Container = styled.View`
  align-self: stretch;
  background-color: ${props => props.theme.viewBackground};
`

const Message = styled.Text`
  color: ${props => props.theme.darkText};
  opacity: 0.8;
  font-size: 17px;
  text-align: center;
  font-variant: small-caps;
  padding: 24px 0;
`

class EmptyGrades extends PureComponent {
  render () {
    return (
      <Container>
        <Message>no grades have been posted</Message>
      </Container>
    )
  }
}

export default EmptyGrades
