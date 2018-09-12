import React, {Component} from 'react'
import {Animated, Dimensions, Platform} from 'react-native'
import {BoxShadow} from 'react-native-shadow'
import styled, { withTheme } from 'styled-components'

const HEIGHT = 80

const CardBoundary = styled.View`
  height: ${HEIGHT}px;
  background-color: ${props => props.theme.courseCardBackground};
  margin: 10px;
  border-radius: 3px;
  flex-direction: row;
  shadow-color: ${props => props.theme.courseCard.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 2px;
  elevation: 3;
`

const Shadow = Platform.select({
  ios: CardBoundary,
  android: CardBoundary
})

const ColorBar = styled.View`
  height: 100%;
  width: 10px;
  background-color: #F0F0F0;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
`

const EmptyGrade = styled.View`
  width: 110px;
  border-right-width: 1px;
  border-right-color: #F0F0F0;
`

const EmptyContent = styled.View`
  flex: 1;
  height: 100%;
  padding-left: 16px;
  padding-top: 16px;
`

const TitleBar = styled(Animated.View)`
  height: 20px;
  width: 150px;
  background-color: #F0F0F0;
  border-radius: 3px;
`

const SubtitleBar = styled(Animated.View)`
  height: 12px;
  width: 120px;
  background-color: #F0F0F0;
  margin-top: 4px;
  border-radius: 3px;
`

class CourseSkeletonCard extends Component {
  constructor (props) {
    super(props)
    this.animation = new Animated.Value(0)
  }

  componentDidMount () {
    Animated.loop(Animated.timing(this.animation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true
    })).start()
  }

  render () {
    const scale = this.animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.02, 1]
    })

    const scaleXY = [{scale}]

    return (
      <Shadow>
        <ColorBar />
        <EmptyGrade />
        <EmptyContent>
          <TitleBar style={{transform: scaleXY}} />
          <SubtitleBar style={{transform: scaleXY}} />
        </EmptyContent>
      </Shadow>
    )
  }
}

export default withTheme(CourseSkeletonCard)
