/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {aboutPageDefaults} from '../../constants/colors';
import ListItem from './ListItem';
import Ripple from 'react-native-material-ripple';
import {Actions} from 'react-native-router-flux';

const imageSize = 45;
const listIconSize = 34;
const listTextSize = 20;

let AboutPage = (props) => {
	let {backgroundColor, headerColor, headerTextColor, bodyTextColor, logoBackground} = props.colors;
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'space-around',
			backgroundColor: backgroundColor || aboutPageDefaults.backgroundColor
		},
		greetingSection: {
			flex: 3,
			alignItems: 'center',
			justifyContent: 'center',
			flexDirection: 'column',
			backgroundColor: headerColor || aboutPageDefaults.headerColor,
			width: '100%'
		},
		contentContainer: {
			flex: 8,
			backgroundColor: 'transparent',
			width: '100%',
			alignItems: 'center'
		},
		logoContainer: {
			padding: 5,
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: logoBackground || '#fff',
			borderRadius: 10,
			marginBottom: 20
		},
		logo: {
			height: imageSize,
			width: imageSize * (1438 / 1378),
		},
		greetingContainer: {
			backgroundColor: 'transparent'
		},
		greeting: {
			color: headerTextColor || '#fff',
			textAlign: 'center',
			fontSize: 28
		},
		listContainer: {
			flex: 8,
			width: '75%',
			backgroundColor: 'transparent',
			flexDirection: 'column',
			justifyContent: 'center',
		},
		buttonContainer: {
			flex: 2,
			backgroundColor: 'transparent',
			justifyContent: 'flex-end',
			width: '80%'
		},
		button: {
			backgroundColor: '#9595955A',
			justifyContent: 'center',
			borderRadius: 10,
			paddingTop: 20,
			paddingBottom: 20,
			marginBottom: 30
		},
		buttonText: {
			color: bodyTextColor || '#fff',
			fontSize: 24,
			textAlign: 'center'
		}
	});

	return (
		<View style={styles.container}>
			<View style={styles.greetingSection}>
				<View style={styles.logoContainer}>
					<Image style={styles.logo} source={require('../../../img/tracs.png')} resizeMethod='scale'/>
				</View>
				<View style={styles.greetingContainer}>
					<Text style={styles.greeting}>Welcome to TRACS</Text>
				</View>
			</View>
			<View style={styles.contentContainer}>
				<View style={styles.listContainer}>
					<ListItem
						name="bullhorn"
						itemText="Get Announcement notifications"
						iconColor={bodyTextColor || aboutPageDefaults.iconColor}
						textColor={bodyTextColor || aboutPageDefaults.textColor}
						iconSize={listIconSize}
						textSize={listTextSize}
					/>
					<ListItem
						name="list"
						itemText="View all your course sites and project sites"
						iconColor={bodyTextColor || aboutPageDefaults.iconColor}
						textColor={bodyTextColor || aboutPageDefaults.textColor}
						iconSize={listIconSize}
						textSize={listTextSize}
					/>
					<ListItem
						name="hand-o-right"
						itemText="Provide feedback to improve TRACS mobile"
						iconColor={bodyTextColor || aboutPageDefaults.iconColor}
						textColor={bodyTextColor || aboutPageDefaults.textColor}
						iconSize={listIconSize}
						textSize={listTextSize}
					/>
				</View>
				<View style={styles.buttonContainer}>
					<Ripple style={styles.button}  onPress={() => Actions.pop()}>
						<Text style={styles.buttonText}>Continue</Text>
					</Ripple>
				</View>
			</View>
		</View>
	)
};

export default AboutPage;