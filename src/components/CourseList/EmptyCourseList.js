import React, {Component} from 'react'
import {Dimensions} from 'react-native'
import styled from 'styled-components'
import Svg, {Path} from 'react-native-svg'
import ExampleCourseCard from './CourseCard/ExampleCourseCard'
import HandSymbol from './HandSymbol'

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

const message = `You have no Favorited courses\nGo to All Sites and swipe left on a course\nto add favorites to this screen`

class EmptyCourseList extends Component {
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
        <Svg height='55' width='55'>
          <Path d='M29.73,24.23q3.39-4.82,6.5-9.82l-.91-.12a30.62,30.62,0,0,0,4.24,9c.36.53,1.23,0,.87-.5A29.94,29.94,0,0,1,36.28,14a.5.5,0,0,0-.91-.12q-3.12,5-6.5,9.82c-.37.53.5,1,.86.5Z' fill='none' stroke='#808080' />
          <Path d='M24.69,44.18A20.27,20.27,0,0,0,35.14,20.1a.5.5,0,0,0-1,.26,19.27,19.27,0,0,1-10,23c-.58.28-.07,1.15.51.86Z' fill='none' stroke='#808080' />
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
