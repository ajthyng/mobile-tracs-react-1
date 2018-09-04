import React, {PureComponent} from 'react'
import {Dimensions} from 'react-native'
import styled from 'styled-components'
import Svg, {Path} from 'react-native-svg'
import ExampleCourseCard from './CourseCard/ExampleCourseCard'

const Container = styled.View`
  width: 100%;
  align-items: center;
  justify-content: flex-start;
`

const Arrow = styled.View`
  width: 100%;
  height: 40px;
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

const message = `You have no Favorited courses\nGo to All Sites and swipe left on a course\nto add favorites to this screen`

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
    const {height} = Dimensions.get('window')
    this.setState({height: height / 2})
  }

  render () {
    return (
      <Container style={this.state}>
        <Svg height='55' width='50' >
          <Path strokeWidth={2} d='M 40 5 C 40 25 25 51 2 51 M 40.5 5 L 45 20 M 40.5 5 L 30 18' fill='none' stroke='#808080' />
        </Svg>
        <EmptyMessage>
          {message}
        </EmptyMessage>
        <EmptyCourse />
      </Container>
    )
  }
}

export default EmptyCourseList
