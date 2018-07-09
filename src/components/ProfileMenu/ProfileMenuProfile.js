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
import {Image, Platform, View, StyleSheet, Text, Animated} from 'react-native'
import styled from 'styled-components'
import Ripple from 'react-native-material-ripple'

const StyledProfile = styled.View`
	background-color: transparent;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`

const ProfileImage = styled.Image`
	height: ${props => props.diameter};
	width: ${props => props.diameter};
	border-radius: ${props => props.diameter * 0.5}px;
`

const ProfileText = styled.Text`
	color: #363534;
	font-size: ${props => props.size};
	font-weight: bold;
`

class ProfileMenuProfile extends Component {
	kitten = Math.floor(Math.random() * 200)

	render() {
		const {size, diameter} = this.props
		return (
			<StyledProfile>
				<ProfileImage
					diameter={diameter}
					source={{uri: `https://placekitten.com/200/${this.kitten}`}}
				/>
				<ProfileText size={size}>
					Maria
				</ProfileText>
			</StyledProfile>
		)
	}
}

ProfileMenuProfile.defaultProps = {
	diameter: 60
}

export default ProfileMenuProfile