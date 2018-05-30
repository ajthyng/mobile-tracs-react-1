import React, {Component} from 'react';
import {Animated} from 'react-native';
import Ripple from 'react-native-material-ripple';
import styled from 'styled-components';
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

const StyledSitesIcon = styled(Icon)``;

class ArchivedSitesIcon extends Component {
	render() {
		return (
			<AnimatedRipple
				active={this.props.active}
				onPress={this.props.onPress}
				diameter={this.props.diameter * 0.6}
				rippleContainerBorderRadius={this.props.diameter * 0.6}
			>
				<StyledSitesIcon
					size={this.props.size}
					name="eye-slash"
					color="#fff"
				/>
			</AnimatedRipple>
		);
	}
}

export default ArchivedSitesIcon;