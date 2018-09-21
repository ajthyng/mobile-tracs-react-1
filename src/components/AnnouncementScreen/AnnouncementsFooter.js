import React, { PureComponent } from 'react'
import styled from 'styled-components'
import RoundedButton from '../CourseDetailScreen/RoundedButton'

const Container = styled.View`
  align-self: stretch;
  align-items: center;
  justify-content: center;
  height: 80px;
  background-color: ${props => props.theme.viewBackground};
`

const CourseSiteButton = styled(RoundedButton)`
  width: 290px;
  border-radius: 24px;
`

class GradebookFooter extends PureComponent {
  render () {
    const { onPress } = this.props
    return (
      <Container>
        <CourseSiteButton title='Course Site' onPress={onPress} />
      </Container>
    )
  }
}

export default GradebookFooter
