/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, {Component} from 'react'
import {StyleSheet, View, Dimensions, Animated, Easing} from 'react-native'
import {connect} from 'react-redux'
import styled, {withTheme} from 'styled-components'
import {Menu, MenuTrigger, MenuOptions, MenuOption, renderers} from 'react-native-popup-menu'
import Header from '../CircleHeader/Header'
import Profile from '../CircleHeader/Profile'
import ProfileMenuProfile from './ProfileMenuProfile'
import ProfileMenuOption from './ProfileMenuOption'
import {logout} from '../../actions/login'
import * as Storage from '../../utils/storage'

class CustomMenuRenderer extends Component {
	constructor(props) {
		super(props)
		this.state = {
			slide: new Animated.Value(0)
		}
	}

	componentDidMount() {
		Animated.timing(this.state.slide, {
			duration: 200,
			toValue: 1,
			easing: Easing.out(Easing.cubic),
			useNativeDriver: true
		}).start()
	}

	close() {
		return new Promise(resolve => {
			Animated.timing(this.state.slide, {
				duration: 200,
				toValue: 0,
				easing: Easing.in(Easing.cubic),
				useNativeDriver: true
			}).start(resolve)
		})
	}

	render() {
		const {style, children, layouts, top, ...other} = this.props
		const width = layouts.windowLayout.width * 0.5
		const layout = {top: -top, right: 0, height: '100%', position: 'absolute', width}
		const animation = {
			transform: [{
				translateX: this.state.slide.interpolate({
					inputRange: [0, 1],
					outputRange: [width, 0]
				})
			}]
		}

		return (
			<Animated.View {...other} style={[style, layout, animation]}>
				{children}
			</Animated.View>
		)
	}
}

class ProfileMenu extends Component {
	render() {
		return (
			<Menu renderer={CustomMenuRenderer} rendererProps={{top: (this.props.offset || 0) * 0.8}}
						onSelect={val => this.props.navigation.navigate(val, {transition: 'cardFromRight'})}>
				<MenuTrigger>
					<Profile
						size={28}
						diameter={Header.CIRCLE_DIAMETER}
					/>
				</MenuTrigger>
				<MenuOptions customStyles={optionStyles(this.props)}>
					<ProfileMenuProfile size={22} diameter={50} />
					<MenuOption value="Settings" customStyles={{optionWrapper: optionStyles(this.props).topOption}}>
						<ProfileMenuOption label="Settings" icon="cog" size={22}/>
					</MenuOption>
					<MenuOption value="Feedback">
						<ProfileMenuOption label="Feedback" icon="comments-o" size={22}/>
					</MenuOption>
					<MenuOption value="Support">
						<ProfileMenuOption label="Support" icon="question-circle-o" size={22}/>
					</MenuOption>
					<MenuOption value="Logout" onSelect={this.props.logout}>
						<ProfileMenuOption label="Logout" icon="logout" size={22} iconFamily='SimpleLineIcons'/>
					</MenuOption>
				</MenuOptions>
			</Menu>
		)
	}
}

const optionStyles = (props) => ({
	optionsContainer: {
		marginTop: (props.offset || 0) * 0.8,
		paddingTop: 40,
		paddingLeft: 0,
		paddingRight: 0,
		paddingBottom: 0,
		backgroundColor: 'white'
	},
	topOption: {
		marginTop: 30
	},
	optionText: {
		color: '#363534'
	}
})

const mapDispatchToProps = dispatch => ({
	logout: () => {
		Storage.credentials.reset();
		dispatch(logout())
	}
})

export default connect(null, mapDispatchToProps)(withTheme(ProfileMenu))