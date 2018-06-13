import React, {Component} from 'react';
import {View, FlatList, Animated, StyleSheet, Text} from 'react-native';

import {connect} from 'react-redux';
import {setScrollY, setHeaderState} from '../../actions/header';

import Header from '../CircleHeader/Header';
import CourseCard from './CourseCard';

const renderHeader = () => (<View style={{flex: 0, height: Header.MAX_HEIGHT + 40, width: '100%'}}/>);

class CourseList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			y: 0,
			shouldCollapse: false,
			shouldExpand: false
		};
		this.data = [
			{
				key: '0',
				name: "Class Name 103.456",
				instructor: "Professor Xavier",
				grades: [
					{name: "Gradebook Item 1", grade: 90, points: 100},
					{name: "Gradebook Item 2", grade: 90, points: 100},
					{name: "Gradebook Item 3", grade: null, points: 100},
					{name: "Gradebook Item 4", grade: 89.95, points: 100}
				]
			},
			{
				key: '1',
				name: "US 1100 random digits and stuff",
				instructor: "Professor Wolverine",
				grades: [
					{name: "Gradebook Item 0", grade: 45, points: 50}
				]
			},
			{
				key: '2',
				name: "CS 1301 2018.2.1080",
				instructor: "Professor Phillip",
				grades: []
			},
			{
				key: '3',
				name: "Class Name 103.456",
				instructor: "Professor Xavier",
				grades: [
					{name: "Gradebook Item 1", grade: 90, points: 100},
					{name: "Gradebook Item 2", grade: 90, points: 100},
					{name: "Gradebook Item 3", grade: 90, points: 100},
					{name: "Gradebook Item 4", grade: 89.95, points: 100}
				]
			},
			{
				key: '4',
				name: "Class Name 103.456",
				instructor: "Professor Xavier",
				grades: [
					{name: "Gradebook Item 1", grade: 90, points: 100},
					{name: "Gradebook Item 2", grade: 90, points: 100},
					{name: "Gradebook Item 3", grade: 90, points: 100},
					{name: "Gradebook Item 4", grade: 89.95, points: 100}
				]
			},
			{
				key: '5',
				name: "HST 103.456 v2018.1030",
				instructor: "Professor Cyclops",
				grades: [
					{name: "Gradebook Item 1", grade: 90, points: 100},
					{name: "Gradebook Item 2", grade: 90, points: 100},
					{name: "Gradebook Item 3", grade: 90, points: 100},
					{name: "Gradebook Item 4", grade: 89.95, points: 100}
				]
			},
			{
				key: '6',
				name: "Worst Class Ever 👌👌",
				instructor: "Professor Metal Guy",
				grades: [
					{name: "Gradebook Item 1", grade: 90, points: 100},
					{name: "Gradebook Item 2", grade: 90, points: 100},
					{name: "Gradebook Item 3", grade: 90, points: 100},
					{name: "Gradebook Item 4", grade: 89.95, points: 100}
				]
			},
		];
		this._scrollY = new Animated.Value(0);
		props.setScrollY(this._scrollY);
	}

	onScrollEndSnapToEdge = (event) => {
		if (!this.scrollView) return;

		const y = event.nativeEvent.contentOffset.y;
		const minHeight = Header.MIN_HEIGHT + 40;
		const shouldSnapToOpen = 0 < y && y < minHeight / 2;
		const shouldSnapToShut = minHeight / 2 <= y && y < minHeight;
		if (shouldSnapToOpen) {
			this.scrollView.scrollTo({y: 0});
		} else if (shouldSnapToShut) {
			this.scrollView.scrollTo({y: minHeight});
		}
	};

	moveHeaderBy = (units) => {
		if (this.scrollView) {
			this.scrollView.scrollTo({y: units});
		}
	};

	componentDidUpdate(prevProps) {
		if (prevProps.isCollapsed !== this.props.isCollapsed) {
			this.moveHeaderBy(prevProps.isCollapsed ? 0 : Header.MIN_HEIGHT + 40);
		}
	}

	goToCourse = (item) => {
		return () => {
			this.props.navigation.navigate('Course', {transition: 'cardFromRight', name: item.name});
			this.props.setHeaderState(Header.COLLAPSED);
		}
	};

	render() {
		return (
			<View style={styles.container}>
				<Animated.ScrollView
					styles={styles.scrollView}
					ref={ref => this.scrollView = ref ? ref._component : {scrollTo: () => {}}}
					onScroll={Animated.event(
						[
							{
								nativeEvent: {contentOffset: {y: this._scrollY}}
							}
						],
						{
							useNativeDriver: true,
							listener: (event) => {
								let y = event.nativeEvent.contentOffset.y;
								this.setState({y});
							}
						}
					)}
					onScrollEndDrag={this.onScrollEndSnapToEdge}
					scrollEventThrottle={16}
				>
					{renderHeader()}
					{this.data.map(item => {
						return <CourseCard {...item} goToCourse={this.goToCourse(item)}/>
					})}
				</Animated.ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%'
	},
	scrollView: {
		flex: 1,
		zIndex: 1
	}
});

const mapStateToProps = (state) => {
	return {
		isCollapsed: state.header.isCollapsed
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		setScrollY: (scrollY) => dispatch(setScrollY(scrollY.interpolate({
			inputRange: [0, Header.MIN_HEIGHT],
			outputRange: [0, 1],
			extrapolate: 'clamp'
		}))),
		setHeaderState: (isCollapsed) => dispatch(setHeaderState(isCollapsed))
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseList);