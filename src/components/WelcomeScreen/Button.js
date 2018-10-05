import React, { PureComponent } from 'react'
import styled from 'styled-components'

const Container = styled.TouchableOpacity`
  flex-grow: 0;
  flex-shrink: 0;
  padding: 16px;
`

const Label = styled.Text`
  font-size: 16px;
  font-weight: 400;
  text-transform: uppercase;
  color: white;
`

class Button extends PureComponent {
  onPress = () => {
    this.props.onPress && this.props.onPress()
  }

  render () {
    const { label, style } = this.props
    return (
      <Container onPress={this.onPress} style={[style]}>
        <Label>{label}</Label>
      </Container>
    )
  }
}

export default Button
