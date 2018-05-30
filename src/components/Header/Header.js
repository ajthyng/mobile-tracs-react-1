import React, {Component} from 'react';
import {View, StatusBar, Dimensions, Animated, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import HomeIcon from './HomeIcon';
import ArchivedSitesIcon from './ArchivedSitesIcon';
import Profile from './Profile';
import styled from 'styled-components';
import ProjectIcon from './ProjectIcon';
import CalendarIcon from './CalendarIcon';

const DIAMETER = 80;
const MAX_HEIGHT = 150;
const HOME_ICON_SIZE = DIAMETER * 0.6;

const Circle = Animated.createAnimatedComponent(styled.View`
	width: ${props => props.active ? props.radius : props.radius * 0.8}; 
	height: ${props => props.active ? props.radius : props.radius * 0.8}; 
	border-radius: ${props => props.radius / 2}px;
	position: absolute;
	bottom: ${props => props.active ? 0 : props.radius * 0.1}px;
	margin-left: ${props => props.active ? 0 : props.radius*0.1};
	flex: 0;
	background-color: ${props => props.active ? '#4a89f4' : '#224575'};
	z-index: 4;
`);

const VisibleHeader = Animated.createAnimatedComponent(styled.View`
		position: absolute;
		top: 0;
		height: ${props => props.height};
		width: 100%;
		background-color: #224575;
		zIndex: 2;
		justify-content: flex-end;

`);

const HeaderContainer = styled.View`
		position: absolute;
		flex: 1;
		zIndex: 2;
		height: ${props => (props.height + props.radius / 2)}px;
		width: 100%;
		background-color: transparent;
		justify-content: flex-end;
`;

const TopIconRow = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin-left: 16px;
	margin-right: 16px;
	margin-bottom: 0;
	height: ${props => props.height};
	background-color: transparent;
	z-index: 4;
`;

const BottomIconRow = styled(Animated.View)`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin-left: 16px;
	margin-right: 16px;
	height: ${props => props.height};
	margin-bottom: ${props => props.diameter / 2}px;
	background-color: transparent;
	z-index: 4;
`;

class Header extends Component {
	static MAX_HEIGHT = MAX_HEIGHT;
	static MIN_HEIGHT = MAX_HEIGHT - 65;

	static ICON = {
		HOME: 0,
		HIDDEN: 1,
		PROJECT: 2
	};

	constructor(props) {
		super(props);
		if (global.android) StatusBar.setBackgroundColor('#224575');
		StatusBar.setBarStyle('light-content');

		this.state = {
			icon: {
				height: HOME_ICON_SIZE,
				width: HOME_ICON_SIZE
			},
			circle: {
				left: (Dimensions.get('window').width - DIAMETER) / 2
			},
			activeIcon: Header.ICON.HOME
		};
	}

	componentDidMount() {
		Dimensions.addEventListener('change', this.updateCenter);
	}

	componentWillUnmount() {
		Dimensions.removeEventListener('change', this.updateCenter);
	}

	updateCenter = ({window}) => {
		this.setState(prevState => ({
				circle: {
					...prevState.circle,
					left: (window.width - DIAMETER) / 2
				}
			})
		);
	};

	updateSize = (icon) => {
		this.setState(prevState => ({
				icon: {
					...prevState.icon,
					height: icon.height,
					width: icon.width
				}
			})
		);
	};

	render() {

		let normalTransform = [{
			translateY: this.props.animationRange.interpolate({
				inputRange: [0, 1],
				outputRange: [0, -Header.MIN_HEIGHT]
			})
		}];

		let iconOpacityRange = {
			opacity: this.props.animationRange.interpolate({
				inputRange: [0, 1],
				outputRange: [1, 0]
			})
		};

		let scrollAnimation = {
			transform: normalTransform
		};

		let circleAnimation = {
			opacity: iconOpacityRange.opacity,
			transform: [{
				translateY: this.props.animationRange.interpolate({
					inputRange: [0, 1],
					outputRange: [0, -Header.MIN_HEIGHT - this.state.icon.height / 3.5]
				})
			}]
		};

		let bottomIconsTranslate = {
			transform: normalTransform
		};

		return (
			<HeaderContainer
				height={Header.MAX_HEIGHT}
				radius={DIAMETER}
				pointerEvents='box-none'
			>
				<VisibleHeader
					height={Header.MAX_HEIGHT}
					style={scrollAnimation}
				/>
				<TopIconRow height={Header.MAX_HEIGHT - Header.MIN_HEIGHT + 24}>
					<CalendarIcon
						size={28}
						diameter={DIAMETER}
						animationRange={this.props.animationRange}
					/>
					<Profile
						size={28}
						diameter={DIAMETER}
						animationRange={this.props.animationRange}
					/>
				</TopIconRow>
				<BottomIconRow
					height={Header.MAX_HEIGHT - Header.MIN_HEIGHT}
					diameter={DIAMETER}
					style={[bottomIconsTranslate, iconOpacityRange]}
				>
					<ArchivedSitesIcon
						onPress={() => {
							this.setState(prevState => ({...prevState, activeIcon: Header.ICON.HIDDEN}));
						}}
						active={this.state.activeIcon === Header.ICON.HIDDEN}
						size={28}
						diameter={DIAMETER}
						bottomSpacing={this.state.icon.height * 0.4}
					/>
					<ProjectIcon
						onPress={() => {
							this.setState(prevState => ({...prevState, activeIcon: Header.ICON.PROJECT}));
						}}
						active={this.state.activeIcon === Header.ICON.PROJECT}
						size={28}
						diameter={DIAMETER}
						bottomSpacing={this.state.icon.height * 0.4}
					/>
				</BottomIconRow>
				<Circle
					active={this.state.activeIcon === Header.ICON.HOME}
					style={circleAnimation}
					radius={DIAMETER}
					left={this.state.circle.left}
				/>
				<HomeIcon
					onPress={() => {
						this.setState(prevState => ({...prevState, activeIcon: Header.ICON.HOME}));
					}}
					animationRange={this.props.animationRange}
					updateSize={this.updateSize}
					diameter={DIAMETER}
				/>
			</HeaderContainer>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		animationRange: state.header.scrollY
	}
};

export default connect(mapStateToProps, null)(Header);