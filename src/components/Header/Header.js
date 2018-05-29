import React, {Component} from 'react';
import {View, StatusBar, Dimensions, Animated, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import HomeIcon from './HomeIcon';
import styled from 'styled-components';

const RADIUS = 80;
const HOME_ICON_SIZE = RADIUS * 0.6;
const MAX_HEIGHT = 150;

const Circle = Animated.createAnimatedComponent(styled.View`
	width: ${props => props.radius}; 
	height: ${props => props.radius}; 
	border-radius: ${props => props.radius / 2}px;
	position: absolute;
	bottom: 0;
	left: ${props => (Dimensions.get('window').width - props.radius) / 2};
	background-color: #4a89f4;
	overflow: visible;
	z-index: 4;
`);

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

		return (
			<View style={styles.container} pointerEvents='box-none'>
				<Animated.View style={[styles.header, animation]}/>
				<Animated.View
					style={[styles.circle, circleFade]}
				/>
				<Circle style={circleFade} radius={RADIUS} />
				<HomeIcon radius={RADIUS}/>
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
	}
});

const mapStateToProps = (state) => {
	return {
		animationRange: state.header.scrollY
	}
};

export default connect(mapStateToProps, null)(Header);