import React, { PureComponent } from 'react'
import styled from 'styled-components'

const Container = styled.View`
  flex: 1;
  justify-content: flex-end;
`

const TracsLogo = styled.Image`
  width: 150px;
  height: 144px;
  padding: 16px;
  margin-bottom: 16px;
  align-self: center;
  box-shadow: 2px 1px 1px #808080;
  
`

class PageTwo extends PureComponent {
  render () {
    return (
      <Container>
        <TracsLogo source={require('../../../../img/small_tracs.png')} />
      </Container>
    )
  }
}

export default PageTwo
