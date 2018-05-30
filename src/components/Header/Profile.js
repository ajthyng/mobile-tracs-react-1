import React, {Component} from 'react';
import {Image, Platform, View, StyleSheet, Text, Animated} from 'react-native';
import styled from 'styled-components';
import Ripple from 'react-native-material-ripple';

const AnimatedRipple = styled(Animated.createAnimatedComponent(Ripple))`
	flex-direction: row;
	align-items: center;
	justify-content: center;
	z-index: 4;
`;

const StyledProfile = styled.View`
	background-color: transparent;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	margin-right: 6px;
`;

const ProfileImage = styled.Image`
	height: ${props => props.diameter};
	width: ${props => props.diameter};
	border-radius: ${props => props.diameter / 2}px;
`;

const ProfileText = styled.Text`
	color: white;
	margin-left: 8px;
	font-size: 16px;
	font-weight: bold;
`;

class Profile extends Component {
	render() {
		return (
			<AnimatedRipple
				rippleContainerBorderRadius={this.props.diameter / 2}
			>
				<StyledProfile>
					<ProfileImage
						diameter={this.props.diameter * 0.4}
						source={{uri: "https://staging.tracs.txstate.edu/profile2-tool/images/no_image.gif"}}
					/>
					<ProfileText>
						Maria
					</ProfileText>
				</StyledProfile>
			</AnimatedRipple>
		);
	}
}

export default Profile;