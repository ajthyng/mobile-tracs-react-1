import React, { PureComponent } from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components'
import ExampleCourseCard from './CourseCard/ExampleCourseCard'
import Arrow from './Arrow'

const Container = styled.View`
  width: 100%;
  align-items: center;
  justify-content: flex-start;
`

const EmptyMessage = styled.Text`
  text-align: center;
  color: #808080;
  font-size: 14px;
  font-weight: 400;
`

const EmptyCourse = styled(ExampleCourseCard)`
  margin-top: 16px;
`

const message = `You have no Favorited courses\nGo to All Sites and press the star\nto add favorites to this screen`

class EmptyCourseList extends PureComponent {
  state = {
    height: Dimensions.get('window').height / 2
  }
  componentDidMount () {
    Dimensions.addEventListener('change', this.updateSize)
  }

  componentWillUnmount () {
    Dimensions.removeEventListener('change', this.updateSize)
  }

  updateSize = () => {
    const { height } = Dimensions.get('window')
    this.setState({ height: height / 2 })
  }

  render () {
    return (
      <Container style={this.state}>
        <Arrow height={60} width={60} />
        <EmptyMessage>
          {message}
        </EmptyMessage>
        <EmptyCourse />
      </Container>
    )
  }
}

export default EmptyCourseList
