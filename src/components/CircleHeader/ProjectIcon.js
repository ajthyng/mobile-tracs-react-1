import React, {Component} from 'react';
import {Image, Platform, View, StyleSheet, Text, Animated} from 'react-native';
import styled from 'styled-components';
import Ripple from 'react-native-material-ripple';
import Icon from 'react-native-vector-icons/FontAwesome';

const AnimatedRipple = styled(Animated.createAnimatedComponent(Ripple))`
	height: ${props => props.diameter};
	width: ${props => props.diameter};
	background-color: ${props => props.active ? '#4a89f4' : 'transparent'};
	border-radius: ${props => props.diameter / 2}px;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	z-index: 4;
`;

const StyledProjectIcon = styled(Icon)``;

class ProjectIcon extends Component {
	render() {
		return (
			<AnimatedRipple
				active={this.props.active}
				onPress={this.props.onPress}
				diameter={this.props.diameter * 0.6}
				rippleContainerBorderRadius={this.props.diameter * 0.6}
			>
				<StyledProjectIcon
					diameter={this.props.diameter / 2}
					size={this.props.size}
					color="#fff"
					name="folder-open-o"
				/>
			</AnimatedRipple>
		);
	}
}

export default ProjectIcon;