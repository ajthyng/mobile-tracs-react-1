import React, {PureComponent} from 'react'
import styled from 'styled-components'

const Container = styled.View`
  flex: 1;
  align-items: flex-start;
  justify-content: center;
  padding-left: 16px;
  padding-bottom: 8px;
`

const Name = styled.Text`
  font-size: 22px;
  line-height: 22px;
  font-weight: 300;
`

const Instructor = styled.Text`
  font-weight: 100;
`

class CourseInfo extends PureComponent {
  render () {
    const {name, instructor} = this.props
    return (
      <Container>
        <Name>{name}</Name>
        <Instructor>{instructor}</Instructor>
      </Container>
    )
  }
}

export default CourseInfo
