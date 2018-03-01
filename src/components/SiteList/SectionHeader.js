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
import {StyleSheet, View, Text} from 'react-native';
import {app} from '../../constants/colors';
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: app.backgroundColor
	},
	text: {
		fontSize: 12,
		marginLeft: 10,
		marginTop: 10,
		paddingBottom: 5,
		color: '#363534'
	}
});

export default class SectionHeader extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={(this.props.styles || styles).text}>
					{(this.props.sectionTitle || "").toUpperCase()}
				</Text>
			</View>
		)
	}
}