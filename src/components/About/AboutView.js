/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, {Component} from 'react';
import {Animated, BackHandler, Image, StyleSheet, View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Swiper from 'react-native-swiper';
import {Analytics} from '../../utils/analytics';
import Orientation from 'react-native-orientation'

const styles = StyleSheet.create({
	wrapper: {},
	image: {
		flex: 1,
		resizeMode: 'cover',
		width: null,
		height: null
	},
});

export default class AboutView extends Component {
	handleBack = () => {
		Actions.pop();
		return true;
	};
	onIndexChanged = (index) => {
		this.setState({
			index
		});
	};

	constructor(props) {
		super(props);
		this.state = {
			activeDotColor: '#fff',
			activeDotSizeStyle: {
				width: new Animated.Value(12),
				height: new Animated.Value(12),
				borderRadius: new Animated.Value(6)
			},
			index: 0
		};
		this.dot = (
			<Animated.View
				style={{
					backgroundColor: '#808080',
					width: 8,
					height: 8,
					borderRadius: 4,
					margin: 3
				}}
			/>
		);
		this.activeDot = (
			<Animated.View
				style={{
					backgroundColor: this.state.activeDotColor,
					...this.state.activeDotSizeStyle,
					margin: 3
				}}
			/>
		);

		this.slides = [
			<Image key='0' source={require('../../../img/screen1.png')} style={styles.image} resizeMethod='scale'/>,
			<Image key='1' source={require('../../../img/screen2.png')} style={styles.image} resizeMethod='scale'/>,
			<Image key='2' source={require('../../../img/screen3.png')} style={styles.image} resizeMethod='scale'/>,
			<Image key='3' source={require('../../../img/screen4.png')} style={styles.image} resizeMethod='scale'/>,
			<Image key='4' source={require('../../../img/screen5.png')} style={styles.image} resizeMethod='scale'/>
		];
		Analytics().setScreen('About', 'AboutView');
	}

	componentWillMount() {
		BackHandler.addEventListener(BackHandler.DEVICE_BACK_EVENT, this.handleBack);
		Orientation.lockToPortrait();
	}

	componentWillUnmount() {
		BackHandler.removeEventListener(BackHandler.DEVICE_BACK_EVENT, this.handleBack);
		Orientation.unlockAllOrientations();
	}

	render() {
		return (
			<Swiper
				style={styles.wrapper}
				showsButtons={false}
				loop={false}
				onIndexChanged={this.onIndexChanged}
				dot={this.dot}
				activeDot={this.activeDot}
			>
				{this.slides}
			</Swiper>
		);
	}
}