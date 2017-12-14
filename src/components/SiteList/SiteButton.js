/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ripple from 'react-native-material-ripple';
import {site} from '../../constants/colors';

const badgeSide = 10;
const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		margin: 5
	},
	badge: {
		backgroundColor: site.badgeColor,
		height: badgeSide,
		width: badgeSide,
		borderRadius: badgeSide / 2,
		top: 0,
		left: "60%",
		margin: 'auto',
		position: 'absolute'
	},
	badgeText: {
		color: "#fff"
	}
});

class SiteButton extends Component {
	constructor(props) {
		super(props);
		this.onPress = props.onPress;
	}

	render() {
		return <Ripple onPress={this.onPress}>
			<View style={styles.container}>
				<Icon name={this.props.name}
							size={this.props.size}
							color={this.props.color}/>
				<Text style={{fontSize: this.props.fontSize || 12}}>{this.props.label}</Text>
				{this.props.badgeCount > 0 ? <View style={styles.badge}/> : null}
			</View>
		</Ripple>
	}
}

export default SiteButton;