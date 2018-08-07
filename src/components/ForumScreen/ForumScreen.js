import React, {Component} from 'react'
import styled from 'styled-components'

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
`

class ForumScreen extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Container />
    )
  }
}

export default ForumScreen