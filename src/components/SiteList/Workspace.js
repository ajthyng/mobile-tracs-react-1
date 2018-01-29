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
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {workspace} from '../../constants/colors';
import {Actions} from 'react-native-router-flux';
import Ripple from 'react-native-material-ripple';

const styles = StyleSheet.create({
	container: {
		backgroundColor: workspace.backgroundColor,
		margin: 10,
		height: 50,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3
		},
		shadowRadius: 5,
		shadowOpacity: 1.0
	},
	workspace: {
		flexDirection: 'row',
		height: '100%',
		padding: 10,
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	moreEllipses: {
		alignItems: 'center',
		justifyContent: 'space-around',
		padding: 5
	},
	text: {
		color: workspace.textColor,
		fontSize: 16
	}
});

class Workspace extends Component {
	render() {
		return (
			<View style={styles.container} elevation={2}>
				<Ripple onPress={() => {
					Actions.push('tracsDashboard', {
							baseUrl: `${global.urls.baseUrl}${global.urls.webUrl}/~${this.props.owner}`
						}
					);
				}}>
					<View style={styles.workspace}>
						<Text style={styles.text}>
							My Workspace
						</Text>
						<View style={styles.moreEllipses}>
							<Icon name="ellipsis-h" size={20} color={workspace.textColor}/>
							<Text style={{color: workspace.textColor, fontSize: 12}}>
								more
							</Text>
						</View>
					</View>
				</Ripple>
			</View>
		);
	}
}

export default Workspace;