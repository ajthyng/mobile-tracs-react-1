import React, {Component} from 'react';
import {Animated} from 'react-native';
import Ripple from 'react-native-material-ripple';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/FontAwesome';

const AnimatedRipple = styled(Animated.createAnimatedComponent(Ripple))`
	height: ${props => props.diameter};
	width: ${props => props.diameter};
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
				diameter={this.props.diameter / 2}
				rippleContainerBorderRadius={this.props.diameter / 2}
				style={{
					opacity: this.props.animationRange,
				}}
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