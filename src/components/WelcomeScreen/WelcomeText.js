import React, { PureComponent } from 'react'
import styled from 'styled-components'

const Container = styled.View`
  flex: 1;
  justify-content: center;
`

const Message = styled.Text`
  font-size: 17px;
  color: #363534;
  text-align: center;
`

class WelcomeText extends PureComponent {
  render () {
    const { children, style } = this.props
    return (
      <Container style={style}>
        <Message>{children}</Message>
      </Container>
    )
  }
}

export default WelcomeText
