import React, { PureComponent } from 'react'
import styled from 'styled-components'
import ExampleCourseCard from './ExampleCourseCard'

const Container = styled.View`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
`

class PageFour extends PureComponent {
  render () {
    return (
      <Container>
        <ExampleCourseCard />
      </Container>
    )
  }
}

export default PageFour
