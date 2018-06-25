import React, {Component} from 'react'
import {Image, Platform, View, StyleSheet, Text, Animated} from 'react-native'
import styled from 'styled-components'
import Ripple from 'react-native-material-ripple'

const AnimatedRipple = styled(Animated.createAnimatedComponent(Ripple))`
	flex-direction: row;
	align-items: center;
	justify-content: center;
	z-index: 4;
`

const StyledProfile = styled.View`
	background-color: transparent;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	margin-right: 6px;
`

const ProfileImage = styled.Image`
	height: ${props => props.diameter * 0.8};
	width: ${props => props.diameter * 0.8};
	border-radius: ${props => props.diameter * 0.5 * 0.8}px;
`

const ProfileText = styled.Text`
	color: white;
	margin-left: 8px;
	font-size: 16px;
	font-weight: bold;
`

class Profile extends Component {
	kitten = Math.floor(Math.random() * 200)

	render() {
		return (
			<StyledProfile>
				<ProfileImage
					diameter={this.props.diameter * 0.4}
					source={{uri: `https://placekitten.com/200/${this.kitten}`}}
				/>
				<ProfileText>
					Maria
				</ProfileText>
			</StyledProfile>
		)
	}
}

Profile.defaultProps = {
	diameter: 60
}

export default Profile