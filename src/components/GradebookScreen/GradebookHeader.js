import React, {PureComponent} from 'react'
import styled from 'styled-components'

const Container = styled.View`
  align-self: stretch;
  height: 100px;
  background-color: ${props => props.theme.viewBackground};
  border-bottom-width: 1px;
  border-bottom-color: #80808080;
  padding: 0 0 0 24px;
  justify-content: center;
`

const CourseTitle = styled.Text`
  font-size: 24px;
  color: ${props => props.theme.darkText};
`

const Subtitle = styled.Text`
  font-size: 24px;
  color: ${props => props.theme.darkText};
`

class GradebookHeader extends PureComponent {
  render () {
    const {title} = this.props
    return (
      <Container>
        <CourseTitle>{title}</CourseTitle>
        <Subtitle>Gradebook</Subtitle>
      </Container>
    )
  }
}

export default GradebookHeader
