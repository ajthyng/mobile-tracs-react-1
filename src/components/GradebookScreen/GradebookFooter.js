import React, {PureComponent} from 'react'
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
  height: 40px;
  width: 200px;
  border-radius: 20px;
`

class GradebookFooter extends PureComponent {
  render () {
    const {onPress} = this.props
    return (
      <Container>
        <CourseSiteButton title='Course Site' onPress={onPress} />
      </Container>
    )
  }
}

export default GradebookFooter
