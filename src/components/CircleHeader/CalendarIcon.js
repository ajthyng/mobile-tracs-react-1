import React, {Component} from 'react';
import {Animated} from 'react-native';
import Ripple from 'react-native-material-ripple';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/FontAwesome';

const AnimatedRipple = styled(Animated.createAnimatedComponent(Ripple))`
	flex-direction: row;
	align-items: center;
	justify-content: center;
	margin-left: 8px;
	z-index: 4;
	background-color: transparent;
`;

const StyledCalendarIcon = styled(Icon)`

`;

class CalendarIcon extends Component {
	render() {
		return (
			<AnimatedRipple
				onLayout={this.props.onLayout}
				diameter={this.props.diameter}
				onPress={this.props.onPress}
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