import React, {Component} from 'react';
import {View, StatusBar, Dimensions, Animated, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import HomeIcon from './HomeIcon';
import ArchivedSitesIcon from './ArchivedSitesIcon';
import Profile from '../Header/Profile';
import styled, {withTheme} from 'styled-components';
import ProjectIcon from './ProjectIcon';
import CalendarIcon from './CalendarIcon';
import {setHeaderState, setScrollY} from '../../actions/header'
import VisibleHeader from './VisibleHeader'
import ProfileMenu from '../ProfileMenu/ProfileMenu'

const DIAMETER = 80;
const MAX_HEIGHT = 120;
const HEIGHT = 63;
const HOME_ICON_SIZE = DIAMETER * 0.6;

const Circle = styled(Animated.View)`
	width: ${props => props.radius * props.scale}; 
	height: ${props => props.radius * props.scale}; 
	border-radius: ${props => props.radius * props.scale / 2}px;
	position: absolute;
	bottom: ${props => DIAMETER - (props.radius * (1 + props.scale) / 2)};
	left: ${props => (Dimensions.get('window').width - props.radius * props.scale) / 2};
	background-color: ${props => props.active ? props.theme.selectedHeader : props.theme.header};
	z-index: 4;
	shadow-color: ${props => props.theme.darkText};
	shadow-opacity: 0.5;
	shadow-offset: 0px 2px;
	shadow-radius: 2;
`;

Circle.defaultProps = {
	scale: 0.8,
	radius: DIAMETER
};

const HeaderContainer = styled(Animated.View)`
		position: absolute;
		top: 0;
		flex: 1;
		height: ${props => (props.headerHeight + props.radius / 2)}px;
		width: 100%;
		background-color: transparent;
		justify-content: flex-end;
`;

const TopIconRow = styled.View`
	flex-direction: row;
	align-items: flex-end;
	justify-content: space-between;
	padding: 0 16px 12px 16px;
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	margin-bottom: 0;
	height: ${props => props.topIconRowHeight};
	background-color: transparent;
	z-index: 4;
`;

const BottomIconRow = styled(Animated.View)`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	position: absolute;
	padding: 0 16px 0 16px;
	left: 0;
	right: 0;
	bottom: ${props => props.diameter / 2}px;
	height: ${props => props.bottomRowHeight};
	background-color: ${props => props.theme.transparent};
	z-index: 3;
`;

class Header extends Component {
	static HEIGHT = HEIGHT;
	static CIRCLE_DIAMETER = DIAMETER;
	static MAX_HEIGHT = MAX_HEIGHT;
	static MIN_HEIGHT = MAX_HEIGHT - HEIGHT;
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
		this.animationRange = props.animationRange
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
		this.props.navigation.navigate('Calendar', {transition: 'cardFromBottom'});
	};

	componentDidUpdate (prevProps) {
		const headerWasNotCollapsed = !prevProps.isCollapsed
		const headerIsNowCollapsed = this.props.isCollapsed
		if (headerWasNotCollapsed && headerIsNowCollapsed) {

		}
	}

	render() {
		let normalTransform = [{
			translateY: this.animationRange.interpolate({
				inputRange: [0, 1],
				outputRange: [0, -Header.MIN_HEIGHT]
			})
		}];

		let iconOpacityRange = {
			opacity: this.animationRange.interpolate({
				inputRange: [0, 1],
				outputRange: [1, 0]
			})
		};

		let headerAnimation = {
			opacity: this.animationRange.interpolate({
				inputRange: [0, 1],
				outputRange: [0.3, 1]
			}),
			transform: normalTransform
		};

		let circleAnimation = {
			opacity: iconOpacityRange.opacity,
			transform: [{
				translateY: this.animationRange.interpolate({
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
				pointerEvents='box-none'
			>
				<VisibleHeader
					visibleHeight={Header.MAX_HEIGHT}
					scrollAnimation={headerAnimation}
				/>
				<TopIconRow
					ref={c => this.topIconRow = c}
					topIconRowHeight={Header.MAX_HEIGHT - Header.MIN_HEIGHT}
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
						animationRange={this.animationRange}
					/>
					<ProfileMenu navigation={this.props.navigation} offset={Header.CIRCLE_DIAMETER / 2} />
				</TopIconRow>
				{this.renderBottomRow(bottomIconsTranslate, iconOpacityRange)}
				<Circle
					active={this.state.activeIcon === Header.ICON.HOME}
					style={circleAnimation}
					radius={DIAMETER}
					scale={this.state.activeIcon === Header.ICON.HOME ? 1 : 0.8}
				/>
				<HomeIcon
					onPress={() => {
						this.setState(prevState => ({...prevState, activeIcon: Header.ICON.HOME}));
						this.props.setHeaderState(Header.EXPANDED);
						let transition = '';
						switch (this.props.navigation.state.routeName) {
							case 'Calendar':
								transition = 'cardFromTop';
								break;
							case 'Course':
								transition = 'cardFromRight';
								break;
							default:
								transition = 'none';
								break;
						}
						this.props.navigation.navigate('Home', {transition});
					}}
					animationRange={this.animationRange}
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

const mapDispatchToProps = (dispatch, props) => {
	return {
		setHeaderState: (isCollapsed) => {
			if (props.isCollapsed !== isCollapsed) {
				dispatch(setHeaderState(isCollapsed))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Header));