import React, { PureComponent } from 'react'
import styled from 'styled-components'

const Container = styled.View`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: ${props => props.size / 2}px;
  border: #48396A solid 1px;
  margin: 3px;
  background-color: ${props => props.active ? '#48396A' : 'transparent'};
`

class PageDot extends PureComponent {
  render () {
    const { active } = this.props
    const size = active ? 16 : 12
    return (
      <Container active={active} size={size} />
    )
  }
}

export default PageDot
