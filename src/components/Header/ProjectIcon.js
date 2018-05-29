import React, {Component} from 'react';
import {Image, Platform, View, StyleSheet, Text, Animated} from 'react-native';
import styled from 'styled-components';
import Ripple from 'react-native-material-ripple';
import Icon from 'react-native-vector-icons/Octicons';

const AnimatedRipple = styled(Animated.createAnimatedComponent(Ripple))`
	height: ${props => props.diameter};
	width: ${props => props.diameter};
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
				style={{
					opacity: this.props.animationRange
				}}
				diameter={this.props.diameter / 2}
				rippleContainerBorderRadius={this.props.diameter / 2}
			>
				<StyledProjectIcon
					diameter={this.props.diameter / 2}
					size={this.props.size}
					color="#fff"
					name="project"
				/>
			</AnimatedRipple>
		);
	}
}

export default ProjectIcon;