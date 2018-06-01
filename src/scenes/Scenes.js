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

import {View, Easing, Animated, Text} from 'react-native';
import React from 'react';

import {createSwitchNavigator, createStackNavigator} from 'react-navigation';
import HomeIcon from '../components/Header/HomeIcon';

const FakeScene = (title) => {
	return () => (
		<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
			<Text style={{color: '#363534', fontSize: 36, textAlign: 'center'}}>{title}</Text>
		</View>
	)
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
		screen: FakeScene("Calendar"),
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
				duration: 500,
				easing: Easing.out(Easing.poly(4)),
				timing: Animated.timing,
				useNativeDriver: true,
			},
			screenInterpolator: sceneProps => {
				const {layout, position, scene, index, scenes} = sceneProps;
				const toIndex = index;
				const thisSceneIndex = scene.index;

				const toName = scenes[toIndex].route.routeName;
				const fromName = scenes[thisSceneIndex].route.routeName;

				const sameScene = toName === fromName;
				const homeOrCalendar = toName === "Calendar" || toName === "Home";
				const calendarToHome = toName === "Home" && fromName === "Calendar";
				const homeToCalendar = toName === "Calendar" && fromName === "Home";

				const shouldSlideFromLeft = calendarToHome || homeToCalendar || (sameScene && homeOrCalendar);

				const width = layout.initWidth;
				const slideFromLeft = {
					transform: [{
						translateX: position.interpolate({
							inputRange: [thisSceneIndex - 1, thisSceneIndex],
							outputRange: [-width, 0]
						})
					}]
				};

				const slideFromRight = {
					transform: [{
						translateX: position.interpolate({
							inputRange: [thisSceneIndex - 1, thisSceneIndex],
							outputRange: [width, 0]
						})
					}]
				};

				return shouldSlideFromLeft ? slideFromLeft : slideFromRight;
			}
		}
	},
	gestures: {},
});

const AuthenticationNavigator = createSwitchNavigator({
	Home: HomeNavigator,
	Login: {
		screen: LoginScreen,
		navigationOptions: {
			header: null
		}
	}
}, {initialRouteName: 'Login'});

module.exports = {
	Scenes: AuthenticationNavigator
};