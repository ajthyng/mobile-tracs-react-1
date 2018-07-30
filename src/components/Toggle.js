import React, {Component} from 'react'
import {TouchableWithoutFeedback as TouchableContainer, Animated} from 'react-native'
import styled from 'styled-components'

const ToggleContainer = styled.View`
  width: ${props => props.toggleWidth}px;
  height: ${props => props.toggleHeight * 1.5}px;
  background-color: transparent;
  align-items: center;
  justify-content: center;
`

const ToggleTrack = styled.View`
  background-color: ${props => props.on && props.enabled ? props.activeColor : props.disabledColor};
  opacity: ${props => props.ios ? 0.6 : 0.4};
  width: ${props => props.width}px;
  height: ${props => props.ios ? props.height * 1.4 : props.height}px;
  border-radius: ${props => (props.ios ? props.height * 1.4 : props.height) * 0.5}px;
`

const ToggleThumb = styled(Animated.View)`
  background-color: ${props => props.on && props.enabled ? props.activeColor : props.disabledColor};
  width: ${props => props.diameter}px;
  height: ${props => props.diameter}px;
  border-radius: ${props => props.diameter * 0.5}px;
  position: absolute;
  elevation: 3;
  shadow-opacity: 0.3;
  shadow-color: #363534;
  shadow-radius: 2;
  shadow-offset: 0 2px;
  left: ${props => props.ios ? 2 : props.trackHeight * 0.5}px;
  top: ${props => (props.trackHeight * 1.5 - props.diameter) * 0.5 - (props.ios ? 0.5 : 0)}px;
`

class Toggle extends Component {
	constructor(props) {
		super(props)
		this.state = {
      on: this.props.on,
      animationRange: new Animated.Value(this.props.on ? 1 : 0)
    }
  }

	toggle = () => {
		this.props.enabled && this.animateState()
	}

	animateState = () => {
		this.setState(prevState => ({on: !prevState.on}))
		Animated.timing(this.state.animationRange, {
			toValue: this.state.on ? 0 : 1,
			duration: 200,
			useNativeDriver: true
		}).start(() => {
			this.props.onValueChange(this.state.on)
		})
	}

	render() {
		const {disabledColor, activeColor, width, height, ios, enabled} = this.props
		const {on} = this.state

		const diameter = height * 1.25
		const thumbEndPosition = ios ? diameter + 4 : height * 0.9

		const translateX = this.state.animationRange.interpolate({
			inputRange: [0, 1],
			outputRange: [0, width - thumbEndPosition]
		})

		return (
			<TouchableContainer onPress={this.toggle}>
				<ToggleContainer
					toggleWidth={ios ? width : width + diameter}
					toggleHeight={height}
				>
					<ToggleTrack {...this.props} on={on} />
					<ToggleThumb
						on={on}
						enabled={enabled}
						style={{transform: [{translateX}]}}
						trackHeight={height}
						diameter={diameter}
						ios={ios}
						disabledColor={disabledColor}
						activeColor={activeColor}
					/>
				</ToggleContainer>
			</TouchableContainer>
		)
	}
}

Toggle.defaultProps = {
	onPress: () => {
	},
	onValueChange: () => {
	},
	enabled: true,
	width: 16,
	height: 36,
	on: false,
	activeColor: '#501214',
	disabledColor: 'gray'
}

export default Toggle