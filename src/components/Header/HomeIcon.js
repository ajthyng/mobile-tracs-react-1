import React, {Component} from 'react';
import {StyleSheet, Animated, Dimensions, Easing} from 'react-native';
import Header from './Header';
import Ripple from 'react-native-material-ripple';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';

const AnimatedRipple = Animated.createAnimatedComponent(Ripple);
const AnimatedIcon = Animated.createAnimatedComponent(Icon);

class HomeIcon extends Component {
	constructor(props) {
		super(props);

		this.radius = props.radius || 80;
		this.size = props.radius * 0.6;

		this.state = {
			icon: {
				height: this.size,
				width: this.size,
				isSet: false
			}
		};

		this.radius = props.radius || 80;
		this.size = props.radius * 0.6;
	}

	render() {
		let iconExtraSlide = {
			transform: [{
				translateY: this.props.animationRange.interpolate({
					inputRange: [0, 1],
					outputRange: [0, -Header.MIN_HEIGHT - this.state.icon.height * 0.45]
				})
			}]
		};

		return (
			<AnimatedRipple
				style={[
					styles.circle,
					styles.homeIcon,
					{
						backgroundColor: 'transparent',
						left: (Dimensions.get('window').width - this.state.icon.width) / 2,
						bottom: this.radius / 2 - this.state.icon.height / 2
					},
					iconExtraSlide
				]}
				rippleContainerBorderRadius={this.radius / 2}
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
					}
				}}
			>
				<AnimatedIcon
					style={{
						transform: [{
							scale: this.props.animationRange.interpolate({
								inputRange: [0, 1],
								outputRange: [1, 0.7]
							})
						}]
					}}
					size={this.size}
					name="home"
					color='#fff'
				/>
			</AnimatedRipple>
		);
	}
}

const styles = StyleSheet.create({
	circle: {
		width: this.radius, height: this.radius, borderRadius: this.radius / 2,
		position: 'absolute',
		bottom: 0,
		left: (Dimensions.get('window').width - this.radius) / 2,
		backgroundColor: '#4a89f4',
		overflow: 'visible',
		zIndex: 4,
		alignItems: 'center',
		justifyContent: 'center'
	},
	homeIcon: {
		zIndex: 5,
		position: 'absolute',
	}
});

const mapStateToProps = (state) => {
	return {
		animationRange: state.header.scrollY
	}
};

export default connect(mapStateToProps, null)(HomeIcon);