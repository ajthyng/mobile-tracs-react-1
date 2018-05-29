import React, {Component} from 'react';
import {View, StatusBar, Dimensions, Animated, Easing, StyleSheet} from 'react-native';
import Ripple from 'react-native-material-ripple';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';

const RADIUS = 80;
const HOME_ICON_SIZE = RADIUS * 0.6;
const AnimatedRipple = Animated.createAnimatedComponent(Ripple);
const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const MAX_HEIGHT = 150;

class Header extends Component {
	static MAX_HEIGHT = MAX_HEIGHT;
	static MIN_HEIGHT = MAX_HEIGHT - 65;

	constructor(props) {
		super(props);
		if (global.android) StatusBar.setBackgroundColor('#224575');
		StatusBar.setBarStyle('light-content');
		this.state = {
			icon: {
				height: HOME_ICON_SIZE,
				width: HOME_ICON_SIZE,
				isSet: false
			}
		}
	}

	render() {
		let animation = {
			transform: [{
				translateY: this.props.animationRange.interpolate({
					inputRange: [0, 1],
					outputRange: [0, -Header.MIN_HEIGHT]
				})
			}]
		};

		let circleFade = {
			opacity: this.props.animationRange.interpolate({
				inputRange: [0, 1],
				outputRange: [1, 0]
			}),
			transform: [{
				translateY: this.props.animationRange.interpolate({
					inputRange: [0, 1],
					outputRange: [0, -Header.MIN_HEIGHT - this.state.icon.height / 3.5]
				})
			}]
		};

		let iconPopIn = {
			opacity: this.state.icon.isSet ? Animated.timing(new Animated.Value(0), {
				toValue: 1,
				duration: 500,
				easing: Easing.linear
			}).start() : 0
		};

		let iconExtraSlide = {
			transform: [{
				translateY: this.props.animationRange.interpolate({
					inputRange: [0, 1],
					outputRange: [0, -Header.MIN_HEIGHT - this.state.icon.height / 3.5]
				})
			}]
		};

		return (
			<View style={styles.container} pointerEvents='box-none'>
				<Animated.View style={[styles.header, animation]}/>
				<Animated.View
					style={[styles.circle, circleFade]}
				/>
				<AnimatedRipple
					style={[
						styles.circle,
						styles.homeIcon,
						iconPopIn,
						{
							backgroundColor: 'transparent',
							left: (Dimensions.get('window').width - this.state.icon.width) / 2,
							bottom: RADIUS / 2 - this.state.icon.height / 2
						},
						iconExtraSlide
					]}
					rippleContainerBorderRadius={RADIUS / 2}
					onLayout={({nativeEvent: {layout}}) => {
						if (!this.state.icon.isSet) {
							this.setState({
								icon: {
									height: layout.height,
									width: layout.width,
									isSet: true
								}
							});
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
						size={HOME_ICON_SIZE}
						name="home"
						color='#fff'
					/>
				</AnimatedRipple>
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		flex: 0,
		zIndex: 2,
		height: (Header.MAX_HEIGHT + RADIUS / 2),
		width: '100%',
		backgroundColor: 'transparent'
	},
	header: {
		position: 'absolute',
		flex: 0,
		height: Header.MAX_HEIGHT,
		width: '100%',
		backgroundColor: '#224575',
		zIndex: 2
	},
	circle: {
		width: RADIUS, height: RADIUS, borderRadius: RADIUS / 2,
		position: 'absolute',
		bottom: 0,
		left: (Dimensions.get('window').width - RADIUS) / 2,
		backgroundColor: '#4a89f4',
		overflow: 'visible',
		zIndex: 4,
		alignItems: 'center',
		justifyContent: 'center'
	},
	homeIcon: {
		zIndex: 5,
		position: 'absolute'
	}
});

const mapStateToProps = (state) => {
	return {
		animationRange: state.header.scrollY
	}
};

export default connect(mapStateToProps, null)(Header);