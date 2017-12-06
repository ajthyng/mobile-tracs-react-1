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
import {StyleSheet, View} from 'react-native';
import SiteButton from './SiteButton';
import SiteButtonPlaceholder from './SiteButtonPlaceholder';
import {Actions} from 'react-native-router-flux';
import {tool} from '../../constants/tools';

const margin = "25%";
const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		marginLeft: margin,
		marginRight: margin
	}
});

class SiteToolBar extends Component {
	constructor(props) {
		super(props);
	}

	hasTool = (type) => {
		return Object.keys(this.props.siteData.tools).indexOf(type) > -1;
	};

	render() {
		let forumButton;
		if (this.hasTool(tool.FORUM)) {
			forumButton = <SiteButton name="comments"
																style={{flex: 1}}
																color={this.props.color}
																size={24}
																onPress={() => {
																	let props = {
																		renderForums: true,
																		renderAnnouncements: false,
																		renderDashboard: true,
																		siteData: this.props.siteData
																	};
																	Actions.dashboard(props);
																}}
																label="Forums"/>;
		} else {
			forumButton = <SiteButtonPlaceholder size={24} color="transparent"/>;
			styles.container.alignContent = "flex-end"
		}

		return <View style={styles.container}>
			{forumButton}
			<SiteButton name="tachometer"
									style={{flex: 1}}
									color={this.props.color}
									size={24}
									onPress={() => {
										let props = {
											renderForums: this.hasTool(tool.FORUM),
											renderAnnouncements: this.hasTool(tool.ANNOUNCEMENT),
											renderDashboard: true,
											siteData: this.props.siteData
										};
										Actions.dashboard(props);
									}}
									label="Dashboard"/>
		</View>;
	}
}

export default SiteToolBar;