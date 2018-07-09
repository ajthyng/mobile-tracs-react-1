import React, {Component} from 'react'
import {View, FlatList, Animated, StyleSheet, Text} from 'react-native'

import {connect} from 'react-redux'
import {setScrollY, setHeaderState} from '../../actions/header'
import styled from 'styled-components'

import Header from '../CircleHeader/Header'
import CourseCard from './CourseCard'
import CourseSkeletonCard from './CourseSkeletonCard'

const HeaderSpacer = styled.View`
	flex: 0;
	height: ${Header.MAX_HEIGHT + Header.CIRCLE_DIAMETER / 2};
	width: 100%;
`

const CourseListContainer = styled.View`
	flex: 1;
	width: 100%;
`

const CourseFlatList = Animated.createAnimatedComponent(FlatList)

const loadingSites = [
	{ key: '0'},
	{ key: '1'},
	{ key: '2'},
	{ key: '3'},
	{ key: '4'},
	{ key: '5'},
	{ key: '6'}
]

class CourseList extends Component {
	constructor(props) {
		super(props)
		this.state = {
			y: 0
		}
		this._scrollY = new Animated.Value(0)
		props.setScrollY(this._scrollY)
	}

	onScrollEndSnapToEdge = (event) => {
		if (!this.scrollView) return
		const y = event.nativeEvent.contentOffset.y
		const minHeight = Header.MIN_HEIGHT + Header.CIRCLE_DIAMETER / 2
		const shouldSnapToOpen = 0 < y && y < minHeight / 2
		const shouldSnapToShut = minHeight / 2 <= y && y < minHeight
		if (shouldSnapToOpen) {
			this.scrollView.scrollTo({y: 0})
		} else if (shouldSnapToShut) {
			this.scrollView.scrollTo({y: minHeight})
		}
	}

	moveHeaderBy = (units) => {
		if (this.scrollView) {
			this.scrollView.scrollTo({y: units})
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.isCollapsed !== this.props.isCollapsed) {
			this.moveHeaderBy(prevProps.isCollapsed ? 0 : Header.MIN_HEIGHT + Header.CIRCLE_DIAMETER / 2)
		}
	}

	goToCourse = (item) => {
		return () => {
			this.props.navigation.navigate('Course', {transition: 'cardFromRight', name: item.name})
		}
	}

	renderCourses = (loading) => {
		const {sites} = this.props
		if (loading) {
			return loadingSites.map(({key}) => (
				<CourseSkeletonCard key={key} />
			))
		} else {
			return sites.map((item, index) => (
				<CourseCard
					{...item}
					key={index.toString(10)}
					goToCourse={this.goToCourse(item)}
				/>
			))
		}
	}

	render() {
		const eventAnimation = Animated.event(
			[{nativeEvent: {contentOffset: {y: this._scrollY}}}],
			{
				useNativeDriver: true,
				listener: ({nativeEvent: {contentOffset: {y}}}) => {
					this.setState({y})
				}
			}
		)
		return (
			<CourseListContainer>
				<Animated.ScrollView
					ref={ref => this.scrollView = ref ? ref._component : {
						scrollTo: () => {
						}
					}}
					onScroll={eventAnimation}
					onScrollEndDrag={this.onScrollEndSnapToEdge}
					scrollEventThrottle={16}
				>
					<HeaderSpacer/>
					{
						this.renderCourses(this.props.loading)
					}
				</Animated.ScrollView>
			</CourseListContainer>
		)
	}
}

const mapStateToProps = (state) => {
	const sites = Object.keys(state.tracsSites.userSites).reduce((accum, siteId) => {
		accum.push(state.tracsSites.userSites[siteId])
		return accum
	}, [])
	return {
		isCollapsed: state.header.isCollapsed,
		sites
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		setScrollY: (scrollY) => dispatch(setScrollY(scrollY.interpolate({
			inputRange: [0, Header.MIN_HEIGHT],
			outputRange: [0, 1],
			extrapolate: 'clamp'
		}))),
		setHeaderState: (isCollapsed) => dispatch(setHeaderState(isCollapsed))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseList)