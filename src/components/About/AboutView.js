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
import {Text, View, StyleSheet, BackHandler} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Swiper from 'react-native-swiper';

const styles = StyleSheet.create({
	wrapper: {},
	slides: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	slideText: {
		color: '#fefefe',
		fontSize: 24
	},
	slideOne: {
		backgroundColor: '#7f2228'
	},
	slideTwo: {
		backgroundColor: '#6a5638'
	},
	slideThree: {
		backgroundColor: '#005481'
	}
});

export default class AboutView extends Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		BackHandler.addEventListener(BackHandler.DEVICE_BACK_EVENT, this.handleBack);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener(BackHandler.DEVICE_BACK_EVENT, this.handleBack);
	}

	handleBack = () => {
		Actions.pop();
		return true;
	};

	slideText = (text) => {
		return (<Text style={styles.slideText}>{text}</Text>);
	};

	render() {
		return (
			<Swiper style={styles.wrapper} showsButtons={true}>
				<View style={[styles.slides, styles.slideOne]}>
					{this.slideText("Slide One")}
				</View>
				<View style={[styles.slides, styles.slideTwo]}>
					{this.slideText("Slide Two")}
				</View>
				<View style={[styles.slides, styles.slideThree]}>
					{this.slideText("Slide Three")}
				</View>
			</Swiper>
		);
	}
}