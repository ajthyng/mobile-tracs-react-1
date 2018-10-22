import React, { PureComponent } from 'react'
import styled from 'styled-components'

const Container = styled.View`
  flex: 1;
`

class WelcomeImage extends PureComponent {
  render () {
    const { content, style } = this.props
    return (
      <Container style={style}>
        {content && content()}
      </Container>
    )
  }
}

export default WelcomeImage
