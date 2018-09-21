import React, { Component } from 'react'
import { Animated, Easing } from 'react-native'
import styled, { withTheme } from 'styled-components'

const tracsLogo = require('../../img/tracs-logo-center.png')

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: ${props => props.theme.viewBackground};
`

const ImageContainer = styled(Animated.View)`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  align-items: center;
  justify-content: flex-end;
`

const TracsLOGO = styled.Image`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
`

class ActivityIndicator extends Component {
  state = {
    animationRange: new Animated.Value(0)
  }

  rotateImage = () => {
    Animated.loop(
      Animated.timing(this.state.animationRange, {
        toValue: 1,
        duration: 2500,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start()
  }

  componentDidMount () {
    this.rotateImage()
  }

  render () {
    const { size } = this.props
    const { animationRange } = this.state

    const rotate = animationRange.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })

    const transform = {
      transform: [{ rotate }]
    }

    return (
      <Container>
        <ImageContainer style={transform} size={size}>
          <TracsLOGO
            size={size}
            source={tracsLogo}
          />
        </ImageContainer>
      </Container>
    )
  }
}

ActivityIndicator.defaultProps = {
  size: 80
}

export default withTheme(ActivityIndicator)
