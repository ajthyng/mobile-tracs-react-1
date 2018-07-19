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
import Header from '../components/Header/Header'

import React from 'react'
import {View, Easing, Platform, Animated, Dimensions, Text} from 'react-native'

import {createSwitchNavigator, createStackNavigator} from 'react-navigation'
import CalendarScreen from '../components/CalendarScreen/CalendarScreen'
import CourseScreen from '../components/CourseScreen/CourseScreen'
import {cardFromRight, cardFromBottom, cardFromLeft, cardFromTop, defaultTransition} from './Transitions'
import GradebookItems from '../components/GradebookItems/GradebookItems'
import CourseDetailScreen from '../components/CourseDetailScreen/CourseDetailScreen'
import SettingsScreen from '../components/SettingsScreen'
import configureStore from '../store/configureStore'
import TRACSWebView from '../_components/TRACSWebView/TRACSWebNative'
import SimpleWebView from '../_components/SimpleWebView/SimpleWebView'
import AnnouncementsScreen from '../components/AnnouncementsScreen'

Array.prototype.contains = function (value) {
	return this.indexOf(value) >= 0
}

const store = configureStore()

const transitionSpec = {
	duration: Platform.select({android: 500, ios: 500}),
	timing: Animated.timing,
	easing: Easing.out(Easing.poly(4)),
	useNativeDriver: true,
}

const MainNavigator = createStackNavigator(
	{
		Home: {
			screen: HomeScreen
		},
		Course: {
			screen: CourseScreen,
		},
		Calendar: {
			screen: CalendarScreen,
		},
		Gradebook: {
			screen: GradebookItems
		},
		CourseDetail: {
			screen: CourseDetailScreen
		},
		Settings: {
			screen: SettingsScreen,
		},
		Announcements: {
			screen: AnnouncementsScreen
		},
		Feedback: {
			screen: () => <SimpleWebView url={`${global.urls.feedback}`} />
		},
		Support: {
			screen: () => <SimpleWebView url={`${global.urls.support}`} />
		},
		TRACSWeb: {
			screen: TRACSWebView,
		}
	}, {
		initialRouteName: 'Home',
		navigationOptions: {
			header: ({navigation}) => (<Header navigation={navigation} />),
			gesturesEnabled: false
		},
		headerMode: 'float',
		headerTransitionPreset: 'uikit',
		transitionConfig: () => ({
			transitionSpec,
			screenInterpolator: (sceneProps) => {
				const {scene} = sceneProps
				const params = scene.route.params || {}
				const transition = params.transition || 'default'
				return {
					cardFromRight: cardFromRight(sceneProps),
					cardFromLeft: cardFromLeft(sceneProps),
					cardFromTop: cardFromTop(sceneProps),
					cardFromBottom: cardFromBottom(sceneProps),
					default: defaultTransition(sceneProps)
				}[transition]
			}
		}),
		gestures: {},
	}
)

const AuthenticationNavigator = createSwitchNavigator({
		Login: LoginScreen,
		Main: MainNavigator
	}, {
		initialRouteName: 'Login',
		navigationOptions: {header: null},
		resetOnBlur: false
	}
)

module.exports = {
	Scenes: AuthenticationNavigator
}