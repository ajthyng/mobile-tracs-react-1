import React, {Component} from 'react'
import {Animated, Dimensions, View, TouchableOpacity} from 'react-native'
import styled, {withTheme} from 'styled-components'
import Icon from 'react-native-vector-icons/FontAwesome'
import Star from './Star'

const HEIGHT = 80

const CardSwipe = styled(Animated.View)`
  height: ${HEIGHT}px;
  background-color: white;
  shadow-color: ${props => props.theme.courseCard.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 2px;
  elevation: 3;
`

const CardBoundary = styled.View`
  height: ${HEIGHT}px;
  align-self: stretch;
  background-color: ${props => props.theme.courseCard.background};
  border-radius: 2px;
  flex-direction: row;
  overflow: hidden;
`

const ColorBar = styled.View`
  height: 100%;
  width: 10px;
  background-color: ${props => props.theme.courseCard.skeleton};
`

const EmptyGrade = styled.View`
  width: 110px;
  border-right-width: 1px;
  border-right-color: #F0F0F0;
`

const EmptyContent = styled.View`
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

const InactiveStar = styled(Star)`
  padding: 10px;
`

class ExampleCourseCard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cardWidth: Dimensions.get('window').width - 30,
      isOpen: true,
      offset: 0
    }
  }

  render () {
    return (
      <View style={this.props.style}>
        <CardSwipe>
          <CardBoundary>
            <ColorBar />
            <EmptyGrade />
            <EmptyContent>
              <TitleBar />
              <SubtitleBar />
            </EmptyContent>
            <InactiveStar />
          </CardBoundary>
        </CardSwipe>
      </View>
    )
  }
}

export default withTheme(ExampleCourseCard)
