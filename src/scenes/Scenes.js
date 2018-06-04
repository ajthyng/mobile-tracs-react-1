/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import LoginScreen from '../_components/Login/LoginScreen';
import HomeScreen from '../components/Home/HomeScreen';
import Header from '../components/Header/Header';

import {View, Easing, Platform, Animated, Text} from 'react-native';
import React from 'react';

import {createSwitchNavigator, createStackNavigator} from 'react-navigation';
import CalendarScreen from '../components/CalendarScreen';

Array.prototype.contains = function (value) {
	return this.indexOf(value) >= 0;
};

const FakeScene = (title) => {
	return () => (
		<View style={{flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
			<Text style={{color: '#363534', fontSize: 36, textAlign: 'center'}}>{title}</Text>
		</View>
	)
};

const isNavigationBetweenScenes = (to, from, targetOne, targetTwo) => {
	const destinations = [targetOne, targetTwo];
	return destinations.contains(to) && destinations.contains(from);
};

const HomeNavigator = createStackNavigator({
	Right: {
		screen: FakeScene("Right")
	},
	Home: {
		screen: HomeScreen,
		navigationOptions: ({navigation}) => ({
			header: <Header navigation={navigation}/>
		})
	},
	Calendar: {
		screen: CalendarScreen,
		navigationOptions: ({navigation}) => ({
			header: <Header navigation={navigation}/>,
			gesturesEnabled: false,
		})
	}
}, {
	initialRouteName: 'Home',
	transitionConfig: () => {
		return {
			transitionSpec: {
				duration: Platform.select({android: 250, ios: 500}),
				easing: Easing.out(Easing.poly(4)),
				timing: Animated.timing,
				useNativeDriver: true,
			},
			screenInterpolator: sceneProps => {
				const {layout, position, scene} = sceneProps;
				const {index} = scene;

				const width = layout.initWidth;

				const translateX = position.interpolate({
					inputRange: [index - 1, index, index + 1],
					outputRange: [-width, 0, 0]
				});

				const opacity = position.interpolate({
					inputRange: [index - 1, index, index+0.99, index + 1],
					outputRange: [1, 1, 0.3, 0]
				});

				return {opacity, transform: [{translateX: translateX}]};
			}
		}
	},
	cardStyle: {
		backgroundColor: 'rgba(0,0,0,0)',
		opacity: 1,
	},
	gestures: {},
});

const AuthenticationNavigator = createSwitchNavigator({
	Home: HomeNavigator,
}, {initialRouteName: 'Home'});

module.exports = {
	Scenes: AuthenticationNavigator
};