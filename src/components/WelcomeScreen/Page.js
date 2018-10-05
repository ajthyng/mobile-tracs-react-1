import React, { PureComponent } from 'react'
import styled from 'styled-components'

const Container = styled.View`
  flex: 1;
`

class Page extends PureComponent {
  render () {
    const { children } = this.props
    return (
      <Container {...this.props}>{children}</Container>
    )
  }
}

export default Page
