import React, {Component} from 'react'
import styled from 'styled-components'

const Container = styled.View`
  flex: 1;
  align-items: flex-start;
  justify-content: center;
  padding-left: 16px;
  padding-bottom: 8px;
  padding: 16px 8px 24px 12px;
`

const Name = styled.Text`
  font-size: 20px;
  line-height: 20px;
  font-weight: ${props => props.hasNewContent ? '500' : '400'};
  text-decoration: ${props => props.hasNewContent ? 'underline' : 'none'};
`

const Instructor = styled.Text`
  font-weight: 300;
`

class CourseInfo extends Component {
  render () {
    const {name, hasNewContent, instructor} = this.props
    return (
      <Container>
        <Name hasNewContent={hasNewContent} numberOfLines={1} >{name}</Name>
        <Instructor>{instructor}</Instructor>
      </Container>
    )
  }
}

export default CourseInfo
