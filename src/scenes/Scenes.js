/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import LoginScreen from '../_components/Login/LoginScreen'
import HomeScreen from '../components/Home/HomeScreen'
import Header from '../components/CircleHeader/Header'

import {View, Easing, Platform, Animated, Dimensions, Text} from 'react-native'
import React from 'react'

import {FluidNavigator} from 'react-navigation-fluid-transitions'
import {createSwitchNavigator, createStackNavigator} from 'react-navigation'
import CalendarScreen from '../components/CalendarScreen/CalendarScreen'
import CourseScreen from '../components/CourseScreen/CourseScreen'
import {cardFromRight, cardFromBottom, cardFromTop, defaultTransition} from './Transitions'
import TabIcon from '../components/TabHeader/TabIcon'
import styled from 'styled-components'
import HiddenCourses from '../components/HiddenCourses/HiddenCourses'
import configureStore from '../store/configureStore'
import GradebookItems from '../components/GradebookItems/GradebookItems'
import CourseDetailScreen from '../components/CourseDetailScreen/CourseDetailScreen'

Array.prototype.contains = function (value) {
	return this.indexOf(value) >= 0
}

const transitionSpec = {
	duration: Platform.select({android: 500, ios: 500}),
	easing: Easing.out(Easing.poly(4)),
	timing: Animated.timing,
	useNativeDriver: true,
}

const fluid = FluidNavigator({
	Courses: {
		screen: HomeScreen,
	},
	Course: {
		screen: CourseScreen
	}
}, {
	initialRouteName: 'Courses'
})

const MainNavigator = createStackNavigator(
	{
		Home: {
			screen: fluid,
		},
		Calendar: {
			screen: CalendarScreen,
		},
		Gradebook: {
			screen: GradebookItems
		},
		CourseDetail: {
			screen: CourseDetailScreen
		}
	}, {
		initialRouteName: 'Home',
		navigationOptions: {
			header: ({navigation}) => (<Header navigation={navigation}/>),
			gesturesEnabled: false,
			headerMode: 'float',
			headerTransitionPreset: 'uikit',
		},
		//transitionConfig: () => ({
		//	transitionSpec,
		//	screenInterpolator: (sceneProps) => {
		//		const {scene: {index, route}} = sceneProps;
		//		const params = route.params || {};
		//		const transition = params.transition || 'default';
		//
		//		return {
		//			cardFromRight: cardFromRight(sceneProps),
		//			cardFromTop: cardFromTop(sceneProps),
		//			cardFromBottom: cardFromBottom(sceneProps),
		//			default: defaultTransition(sceneProps)
		//		}[transition]
		//	}
		//}),
		cardStyle: {
			opacity: 1,
			shadowOpacity: 0
		},
		gestures: {},
	}
)

const AuthenticationNavigator = createSwitchNavigator({
	Main: MainNavigator
}, {
	initialRouteName: 'Main',
	navigationOptions: {header: null}
})

module.exports = {
	Scenes: AuthenticationNavigator
}