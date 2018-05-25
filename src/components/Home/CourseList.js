import React, {Component} from 'react';
import {View, Animated, StyleSheet, Text} from 'react-native';
import Ripple from 'react-native-material-ripple';

import Header from '../Header/Header';

class CourseList extends Component {
	constructor(props) {
		super(props);
		this.data = [];
		for (let i = 0; i < 100; i++) {
			this.data.push({key: `${i}`, name: `${i}`})
		}
		this._scrollY = new Animated.Value(0);

		this.data = this.data.map(entry => {
			return (
				<Ripple
					key={entry.key}
					style={{
						height: 80,
						backgroundColor: 'white',
						margin: 10,
						alignItems: 'center',
						justifyContent: 'center'
					}}>
					<Text>
						{entry.name}
					</Text>
				</Ripple>
			)
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<Animated.ScrollView
					styles={styles.scrollView}
					onScroll={Animated.event(
						[
							{
								nativeEvent: {contentOffset: {y: this._scrollY}}
							}
						],
						{
							useNativeDriver: true
						}
					)}
					scrollEventThrottle={16}
				>
					<View style={{flex: 0, height: Header.MAX_HEIGHT + 50, width: '100%'}}/>
					{this.data}
				</Animated.ScrollView>
				<Header animationRange={
					this._scrollY.interpolate({
						inputRange: [0, Header.MIN_HEIGHT],
						outputRange: [0, 1],
						extrapolate: 'clamp'
					})
				}/>
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
		flex:1,
		zIndex: 1
	}
});

export default CourseList;