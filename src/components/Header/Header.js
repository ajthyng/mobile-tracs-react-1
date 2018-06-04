import React, {Component} from 'react';
import {View, StatusBar, Dimensions, Animated, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import HomeIcon from './HomeIcon';
import ArchivedSitesIcon from './ArchivedSitesIcon';
import Profile from './Profile';
import styled from 'styled-components';
import ProjectIcon from './ProjectIcon';
import CalendarIcon from './CalendarIcon';
import {setHeaderState} from '../../actions/header';

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
	shadow-color: #363534;
	shadow-opacity: 0.5;
	shadow-offset: 0px 2px;
	shadow-radius: 2;
`);

const VisibleHeader = styled(Animated.View)`
		position: absolute;
		top: 0;
		height: ${props => props.visibleHeaderHeight};
		width: 100%;
		background-color: #224575;
		zIndex: 2;
		justify-content: flex-end;
		shadow-color: #363534;
		shadow-opacity: 0.5;
		shadow-offset: 0px 2px;
		shadow-radius: 2;
`;

const HeaderContainer = styled(Animated.View)`
		position: absolute;
		top: 0;
		flex: 1;
		zIndex: 2;
		height: ${props => (props.headerHeight + props.radius / 2)}px;
		width: 100%;
		background-color: transparent;
		justify-content: flex-end;
`;

const TopIconRow = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding-left: 16px;
	padding-right: 16px;
	margin-bottom: 0;
	height: ${props => props.topIconRowHeight};
	background-color: transparent;
	z-index: 4;
`;

const BottomIconRow = styled(Animated.View)`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin-left: 16px;
	margin-right: 16px;
	height: ${props => props.bottomRowHeight};
	margin-bottom: ${props => props.diameter / 2}px;
	background-color: transparent;
	z-index: 4;
`;

class Header extends Component {
	static MAX_HEIGHT = MAX_HEIGHT;
	static MIN_HEIGHT = MAX_HEIGHT - 65;
	static COLLAPSED = true;
	static EXPANDED = false;

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
			activeIcon: Header.ICON.HOME,
			topRowHeight: 0
		};
		this.animationRange = this.props.animationRange;
	}

	componentDidMount() {
		Dimensions.addEventListener('change', this.updateCenter);
		this.setState({
			topRowHeight: this.topIconRow.props.height
		})
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

	renderBottomRow = (bottomIconsTranslate, iconOpacityRange) => {
		let archivedSitesIcon = (
			<ArchivedSitesIcon
				onPress={() => {
					this.setState(prevState => ({...prevState, activeIcon: Header.ICON.HIDDEN}));
				}}
				active={this.state.activeIcon === Header.ICON.HIDDEN}
				size={28}
				diameter={DIAMETER}
				bottomSpacing={this.state.icon.height * 0.4}
			/>
		);
		let projectIcon = (
			<ProjectIcon
				onPress={() => {
					this.setState(prevState => ({...prevState, activeIcon: Header.ICON.PROJECT}));
				}}
				active={this.state.activeIcon === Header.ICON.PROJECT}
				size={28}
				diameter={DIAMETER}
				bottomSpacing={this.state.icon.height * 0.4}
			/>
		);
		return (
			<BottomIconRow
				bottomRowHeight={Header.MAX_HEIGHT - Header.MIN_HEIGHT}
				diameter={DIAMETER}
				style={[bottomIconsTranslate, iconOpacityRange]}
			>
				{this.props.isCollapsed ? null : archivedSitesIcon}
				{this.props.isCollapsed ? null : projectIcon}
			</BottomIconRow>
		);
	};




	goToCalendar = () => {
		this.props.setHeaderState(Header.COLLAPSED);
		this.props.navigation.navigate('Calendar');
	};

	render() {
		let animationRange = this.animationRange;

		let normalTransform = [{
			translateY: animationRange.interpolate({
				inputRange: [0, 1],
				outputRange: [0, -Header.MIN_HEIGHT]
			})
		}];

		let iconOpacityRange = {
			opacity: animationRange.interpolate({
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
				translateY: animationRange.interpolate({
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
				headerHeight={Header.MAX_HEIGHT}
				radius={DIAMETER}
				pointerEvents='auto'
			>
				<VisibleHeader
					visibleHeaderHeight={Header.MAX_HEIGHT}
					style={scrollAnimation}
				/>
				<TopIconRow
					ref={c => this.topIconRow = c}
					topIconRowHeight={Header.MAX_HEIGHT - Header.MIN_HEIGHT + 24}
				>
					<CalendarIcon
						onLayout={({nativeEvent}) => {
							this.setState({
								topRowCenter: nativeEvent.layout.height / 2
							})
						}}
						size={28}
						onPress={this.goToCalendar}
						diameter={DIAMETER}
						animationRange={animationRange}
					/>
					<Profile
						size={28}
						diameter={DIAMETER}
						animationRange={animationRange}
					/>
				</TopIconRow>
				{this.renderBottomRow(bottomIconsTranslate, iconOpacityRange)}
				<Circle
					active={this.state.activeIcon === Header.ICON.HOME}
					style={circleAnimation}
					radius={DIAMETER}
					left={this.state.circle.left}
				/>
				<HomeIcon
					onPress={() => {
						this.setState(prevState => ({...prevState, activeIcon: Header.ICON.HOME}));
						this.props.setHeaderState(Header.EXPANDED);
						this.props.navigation.navigate('Home');
					}}
					animationRange={animationRange}
					topRowCenter={this.state.topRowHeight / 2}
					updateSize={this.updateSize}
					diameter={DIAMETER}
				/>
			</HeaderContainer>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		animationRange: state.header.scrollY,
		isCollapsed: state.header.isCollapsed
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		setHeaderState: (isCollapsed) => dispatch(setHeaderState(isCollapsed))
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);