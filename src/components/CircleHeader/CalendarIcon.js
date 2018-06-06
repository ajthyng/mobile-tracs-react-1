import React, {Component} from 'react';
import {Animated} from 'react-native';
import Ripple from 'react-native-material-ripple';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/FontAwesome';

const AnimatedRipple = styled(Animated.createAnimatedComponent(Ripple))`
	height: ${props => props.diameter};
	width: ${props => props.diameter};
	margin-left: ${props => -props.iconSize / 2}px;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	z-index: 4;
`;

const StyledCalendarIcon = styled(Icon)``;

class CalendarIcon extends Component {
	render() {
		return (
			<AnimatedRipple
				onLayout={this.props.onLayout}
				diameter={this.props.diameter}
				onPress={this.props.onPress}
				iconSize={this.props.size}
				rippleContainerBorderRadius={this.props.diameter / 2}
			>
				<StyledCalendarIcon
					size={this.props.size}
					name="calendar"
					color="#fff"
				/>
			</AnimatedRipple>
		);
	}
}

CalendarIcon.defaultProps = {
	size: 0,
	diameter: 0,
	onPress: () => {}
};

export default CalendarIcon;