import React, {PureComponent} from 'react'
import {TouchableWithoutFeedback, Animated} from 'react-native'
import styled from 'styled-components'

const Container = styled(Animated.View)`
  border: solid 1px ${props => props.color};
  align-items: center;
  justify-content: center;
`

const Title = styled(Animated.Text)`
  font-size: 22px;
  font-weight: 500;
  padding-bottom: 4px;
  text-decoration: underline;
  text-decoration-color: ${props => props.color};
`

class RoundedButton extends PureComponent {
  driver = new Animated.Value(0)

  onPress = () => {
    this.props.onPress && this.props.onPress()
    this.driver.setValue(0)

    Animated.timing(this.driver, {
      toValue: 1,
      duration: 500
    }).start()
  }

  render () {
    const {title, style} = this.props
    const backgroundColor = this.driver.interpolate({
      inputRange: [0, 0.7, 1],
      outputRange: ['#FFFFFF', '#7473A8', '#FFFFFF']
    })

    const fontColor = this.driver.interpolate({
      inputRange: [0, 0.7, 1],
      outputRange: ['#7473A8', '#FFFFFF', '#7473A8']
    })

    return (
      <TouchableWithoutFeedback onPress={this.onPress} >
        <Container style={[style, {backgroundColor}]} color='#7473a8'>
          <Title style={{color: fontColor, textDecorationColor: fontColor}} color='#7473a8'>{title}</Title>
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
