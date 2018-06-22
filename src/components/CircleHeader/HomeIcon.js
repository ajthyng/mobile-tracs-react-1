import React, {Component} from 'react';
import {StyleSheet, Animated, Dimensions, Easing} from 'react-native';
import styled from 'styled-components';
import Header from './Header';
import Ripple from 'react-native-material-ripple';
import Icon from 'react-native-vector-icons/FontAwesome';

const AnimatedCircle = styled(Animated.createAnimatedComponent(Ripple))`
	width: ${props => props.diameter};
	height: ${props => props.diameter};
	border-radius: ${props => props.diameter / 2}px;
	position: absolute;
	bottom: 0;
	left: ${props => (Dimensions.get('window').width - props.diameter) / 2}px;
	background-color: #4a89f4;
	overflow: visible;
	zIndex: 5;
	alignItems: center;
	justify-content: center;
`;
const AnimatedIcon = Animated.createAnimatedComponent(Icon);

class HomeIcon extends Component {
	static defaultProps = {
		topRowCenter: 0
	};

	constructor(props) {
		super(props);

		this.diameter = props.diameter || 80;
		this.size = props.diameter * 0.6;

		this.state = {
			icon: {
				height: this.size,
				width: this.size,
				isSet: false
			}
		};

		this.diameter = props.diameter || 80;
		this.size = props.diameter * 0.6;
	}

	render() {
		let iconExtraSlide = {
			transform: [{
				translateY: this.props.animationRange.interpolate({
					inputRange: [0, 1],
					outputRange: [0, -Header.MAX_HEIGHT + Header.CIRCLE_DIAMETER / 2]
				})
			}]
		};

		return (
			<AnimatedCircle
				style={[
					styles.homeIcon,
					{
						backgroundColor: 'transparent'
					},
					iconExtraSlide
				]}
				onPress={this.props.onPress}
				diameter={this.diameter}
				rippleContainerBorderRadius={this.diameter / 2}
				onLayout={({nativeEvent: {layout}}) => {
					if (!this.state.icon.isSet) {
						this.setState((prevState) => ({
							icon: {
								...prevState.icon,
								height: layout.height,
								width: layout.width,
								isSet: true
							}
						}));
						this.props.updateSize({
							height: layout.height,
							width: layout.width
						});
					}
				}}
			>
				<AnimatedIcon
					style={{
						transform: [{
							scale: this.props.animationRange.interpolate({
								inputRange: [0, 1],
								outputRange: [1, 0.8]
							})
						}]
					}}
					ref={c => this.icon = c}
					size={this.size}
					name="home"
					color='#fff'
				/>
			</AnimatedCircle>
		);
	}
}

const styles = StyleSheet.create({
	circle: {
		width: this.diameter, height: this.diameter, borderRadius: this.diameter / 2,
		position: 'absolute',
		bottom: 0,
		left: (Dimensions.get('window').width - this.diameter) / 2,
		backgroundColor: '#4a89f4',
		overflow: 'visible',
		zIndex: 4,
		alignItems: 'center',
		justifyContent: 'center'
	},
	homeIcon: {
		zIndex: 5,
	}
});

export default HomeIcon;