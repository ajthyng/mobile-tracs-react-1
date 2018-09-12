import React, {PureComponent} from 'react'
import {TouchableWithoutFeedback, Animated} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import styled from 'styled-components'

const Container = styled.View`
  align-items: center;
  justify-content: center;
`

const StarIcon = styled(Animated.createAnimatedComponent(Icon))`
  color: ${props => props.active ? props.activeColor : props.inactiveColor};
`

class Star extends PureComponent {
  state = {
    driver: new Animated.Value(0),
    active: this.props.active
  }

  onPress = () => {
    this.props.onPress && this.props.onPress()
    this.setState({active: !this.state.active, driver: new Animated.Value(0)}, () => {
      Animated.spring(this.state.driver, {
        toValue: 1,
        duartion: 200,
        useNativeDriver: true,
        friction: 5
      }).start()
    })
  }

  render () {
    const transform = {
      transform: [{
        scale: this.state.driver.interpolate({
          inputRange: [0, 0.7, 1],
          outputRange: [1, 1.1, 1]
        })
      }]
    }

    const {activeColor, inactiveColor, style} = this.props
    const {active} = this.state

    return (
      <TouchableWithoutFeedback onPress={this.onPress}>
        <Container style={[style]}>
          <StarIcon
            style={transform}
            name={active ? 'star' : 'star-o'}
            size={24}
            active={active}
            activeColor={activeColor}
            inactiveColor={inactiveColor}
          />
        </Container>
      </TouchableWithoutFeedback>
    )
  }
}

Star.defaultProps = {
  activeColor: '#F49D08',
  inactiveColor: '#36353480'
}

export default Star
