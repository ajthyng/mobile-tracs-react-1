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
import Header from '../components/TabHeader/Header';

import {View, Easing, Platform, Animated, Dimensions, 	Text} from 'react-native';
import React from 'react';

import {createSwitchNavigator, createMaterialTopTabNavigator, createStackNavigator} from 'react-navigation';
import CalendarScreen from '../components/CalendarScreen';
import CourseScreen from '../components/CourseScreen/CourseScreen';
import {cardFromRight, cardFromTop, defaultTransition} from './Transitions';
import TabIcon from '../components/TabHeader/TabIcon';
import styled from 'styled-components';
import HiddenCourses from '../components/HiddenCourses/HiddenCourses';
import configureStore from '../store/configureStore';

Array.prototype.contains = function (value) {
	return this.indexOf(value) >= 0;
};

const TabLabel = styled.Text`
	margin-top: 8px;
	font-size: 12px;
	color: ${props => props.tintColor};
`;

const transitionSpec = {
	duration: Platform.select({android: 500, ios: 500}),
	easing: Easing.out(Easing.poly(4)),
	timing: Animated.timing,
	useNativeDriver: true,
};

const makeTabIcon = (title) => {
	return ({focused, tintColor}) => (
		<TabIcon scene={title} focused={focused} color={tintColor} />
	);
};

let store = configureStore();
const animationRange = store.getState().header.scrollY;

const CourseScreenTabs = createMaterialTopTabNavigator(
	{
		HiddenCourseList: {
			screen: HomeScreen,
			navigationOptions: {
				tabBarLabel: ({focused, tintColor}) => (<TabLabel tintColor={tintColor}>Hidden</TabLabel>),
				tabBarIcon: makeTabIcon('Hidden')
			}
		},
		CourseList: {
			screen: HomeScreen,
			navigationOptions: {
				tabBarLabel: ({focused, tintColor}) => (<TabLabel tintColor={tintColor}>Home</TabLabel>),
				tabBarIcon: makeTabIcon('Home')
			}
		},
		ProjectCourseList: {
			screen: HomeScreen,
			navigationOptions: {
				tabBarLabel: ({focused, tintColor}) => (<TabLabel tintColor={tintColor}>Projects</TabLabel>),
				tabBarIcon: makeTabIcon('Projects')
			}
		}
	},
	{
		initialRouteName: 'CourseList',
		order: ['HiddenCourseList', 'CourseList', 'ProjectCourseList'],
		paths: {
			Hidden: 'HiddenCourseList',
			Home: 'CourseList',
			Project: 'ProjectCourseList'
		},
		initialLayout: {
			height: 65,
			width: Dimensions.get('window').width
		},
		tabBarOptions: {
			activeTintColor: 'white',
			inactiveTintColor: '#ffffffA0',
			indicatorStyle: {backgroundColor: 'white', height: 2},
			style: {
				backgroundColor: '#224575',
				transform: [{
					translateY: animationRange.interpolate({
						inputRange: [0 ,1],
						outputRange: [0, -65]
					})
				}],
				height: 65,
				shadowOffset: {width: 0, height: 1},
				shadowRadius: 1,
				shadowOpacity: 0.4,
			},
			showIcon: true,
			tabStyle: {
				backgroundColor: 'transparent',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
			}
		}
	}
);

const MainNavigator = createStackNavigator({
		Home: {
			screen: CourseScreenTabs,
		},
		Calendar: {
			screen: CalendarScreen,
		},
		Course: {
			screen: CourseScreen
		}
	}, {
		initialRouteName: 'Home',
		navigationOptions: {
			header: ({navigation}) => (<Header navigation={navigation}/>),
			gesturesEnabled: false,
			headerMode: 'float',
			headerTransitionPreset: 'uikit',
		},
		transitionConfig: () => ({
			transitionSpec,
			screenInterpolator: (sceneProps) => {
				const {scene: {index, route}} = sceneProps;
				const params = route.params || {};
				const transition = params.transition || 'default';

				return {
					cardFromRight: cardFromRight(sceneProps),
					cardFromTop: cardFromTop(sceneProps),
					default: defaultTransition(sceneProps)
				}[transition]
			}
		}),
		cardStyle: {
			backgroundColor: 'white',
			opacity: 1,
		},
		gestures: {},
	}
);

const AuthenticationNavigator = createSwitchNavigator({
	Main: MainNavigator
}, {
	initialRouteName: 'Main',
	navigationOptions: {header: null}
});


module.exports = {
	Scenes: AuthenticationNavigator
};