import React, {Component} from 'react'
import {Animated, Dimensions, View, TouchableOpacity} from 'react-native'
import styled, {withTheme} from 'styled-components'
import Icon from 'react-native-vector-icons/FontAwesome'

const OPEN_WIDTH = -100
const HEIGHT = 80

const ShadowCard = styled.View`
  height: 80px;
  shadow-color: ${props => props.theme.courseCard.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 2px;
  elevation: 3;
`

const CardSwipe = styled(Animated.View)`
  flex: 1;
`

const CardBoundary = styled.View`
  height: 80px;
  width: ${Dimensions.get('window').width - 30}px;
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
    const {cardWidth} = this.state

    const transform = {
      transform: [{
        translateX: OPEN_WIDTH
      }]
    }

    return (
      <View style={this.props.style}>
        <Background cardWidth={cardWidth} >
          <ButtonContainer>
            <Icon ref='icon' name='star' color='#808080' size={24} />
            <IconLabel>ADD TO{'\n'}FAVORITES</IconLabel>
          </ButtonContainer>
        </Background>
        <ShadowCard>
          <CardSwipe style={transform}>
            <CardBoundary>
              <ColorBar />
              <EmptyGrade />
              <EmptyContent>
                <TitleBar />
                <SubtitleBar />
              </EmptyContent>
            </CardBoundary>
          </CardSwipe>
        </ShadowCard>
      </View>
    )
  }
}

const ButtonContainer = styled(TouchableOpacity)`
  height: 100%;
  width: 100px;
  align-items: center;
  justify-content: center;
  z-index: 0;
`

const IconLabel = styled.Text`
  font-size: 10px;
  color: #808080;
  text-align: center;
`

const Background = styled.View`
  position: absolute;
  right: 0;
  height: 80px;
  width: ${props => props.cardWidth}px;
  border-radius: 3px;
  background-color: ${props => props.theme.courseCard.skeleton};
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
`

export default withTheme(ExampleCourseCard)
