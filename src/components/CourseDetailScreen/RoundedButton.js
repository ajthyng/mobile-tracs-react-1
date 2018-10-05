import React, { PureComponent } from 'react'
import { TouchableWithoutFeedback, Animated } from 'react-native'
import styled from 'styled-components'

const Container = styled(Animated.View)`
  border: solid 1px ${props => props.color};
  align-items: center;
  justify-content: center;
`

const Title = styled(Animated.Text)`
  font-size: 18px;
  font-weight: 500;
  padding: 10px 0 14px 0;
  text-decoration: underline;
  text-decoration-color: ${props => props.color};
`

class RoundedButton extends PureComponent {
  driver = new Animated.Value(0)

  onPressIn = () => {
    Animated.timing(this.driver, {
      toValue: 1,
      duration: 0
    }).start()
  }

  onPressOut = () => {
    Animated.timing(this.driver, {
      toValue: 0,
      duration: 100
    }).start()
    this.props.onPress && this.props.onPress()
  }

  render () {
    const { title, style } = this.props
    const backgroundColor = this.driver.interpolate({
      inputRange: [0, 1],
      outputRange: ['#FFFFFF', '#48396A']
    })

    const fontColor = this.driver.interpolate({
      inputRange: [0, 1],
      outputRange: ['#48396A', '#FFFFFF']
    })

    return (
      <TouchableWithoutFeedback onPressIn={this.onPressIn} onPressOut={this.onPressOut} >
        <Container style={[style, { backgroundColor }]} color='#48396A'>
          <Title style={{ color: fontColor, textDecorationColor: fontColor }} color='#48396A'>{title}</Title>
        </Container>
      </TouchableWithoutFeedback>
    )
  }
}

RoundedButton.defaultProps = {
  title: 'Press Here',
  style: {
    width: 250,
    height: 50,
    borderRadius: 20
  }
}

export default RoundedButton
