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
import {Linking, StyleSheet, Text, View} from 'react-native';
import {site} from '../../constants/colors';
import Spacer from '../Helper/Spacer';

const styles = StyleSheet.create({
	container: {
		margin: 12
	},
	titleContainer: {
		backgroundColor: site.dashboardTitleBackground,
		paddingLeft: 6,
		paddingRight: 0,
		paddingTop: 3,
		paddingBottom: 3
	},
	titleText: {
		color: site.dashboardTitleText
	},
	infoLabel: {
		paddingLeft: 7,
		fontWeight: "600",
		color: "#404040"
	},
	contactContainer: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'flex-start',
		paddingLeft: 7
	},
	siteOwnerName: {
		color: "#505050"
	},
	emailText: {
		color: "blue"
	}
});

class DashboardHeader extends Component {
	constructor(props) {
		super(props);
		this.infoLabel = "Site contact and email:";
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.titleContainer}>
					<Text style={styles.titleText}>{this.props.siteName || "Contact TRACS Support"}</Text>
				</View>
				<Spacer height={10}/>
				<Text style={styles.infoLabel}>{this.infoLabel}</Text>
				<View style={styles.contactContainer}>
					<Text style={styles.siteOwnerName}>{this.props.contactName || "TRACS Support"}</Text>
					<Text style={styles.emailText}
								onPress={() => {
									Linking.openURL(`mailto:?to=${this.props.contactEmail}&subject=${this.props.siteName}` || `mailto:?to=tracs@txstate.edu&subject=${this.props.siteName}`)
										.catch(err => {
											console.log("Couldn't open email", err);
										});
								}}>
						{this.props.contactEmail || "tracs@txstate.edu"}
					</Text>
				</View>
			</View>
		)
	}
}

export default DashboardHeader;