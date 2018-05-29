import React, {Component} from 'react';
import {View, StatusBar, Dimensions, Animated, Easing, StyleSheet} from 'react-native';
import Ripple from 'react-native-material-ripple';
import {connect} from 'react-redux';

const RADIUS = 80;
const AnimatedRipple = Animated.createAnimatedComponent(Ripple);
const MAX_HEIGHT = 150;

class Header extends Component {
	static MAX_HEIGHT = MAX_HEIGHT;
	static MIN_HEIGHT = MAX_HEIGHT - 65;

	constructor(props) {
		super(props);
		if (global.android) StatusBar.setBackgroundColor('#365ba9');
		StatusBar.setBarStyle('light-content');
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

		return (
			<View style={styles.container} pointerEvents='box-none'>
				<Animated.View style={[styles.header, animation]}/>
				<AnimatedRipple
					style={[styles.circle, animation]}
					rippleContainerBorderRadius={RADIUS / 2}
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
		zIndex: 4
	}
});

const mapStateToProps = (state) => {
	return {
		animationRange: state.header.scrollY
	}
};

export default connect(mapStateToProps, null)(Header);