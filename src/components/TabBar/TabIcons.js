/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import TabIcon from './TabIcon';
import React from 'react';
const tabIconSize = 24;

const setTabBarColor = (props) => {
	return props.focused ? props.activeTintColor : props.inactiveTintColor;
};

module.exports = {
	announcements: (tabBarProps) => {
		console.log(tabBarProps);
		return <TabIcon name="bullhorn" size={tabIconSize} color={setTabBarColor(tabBarProps)}/>;
	},
	sites: (tabBarProps) => {
		return <TabIcon name="list" size={tabIconSize} color={setTabBarColor(tabBarProps)}/>;
	},
	settings: (tabBarProps) => {
		return <TabIcon name="cog" size={tabIconSize} color={setTabBarColor(tabBarProps)}/>;
	}
};