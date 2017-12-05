import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {site as siteColor} from '../../constants/colors';
import {types as siteType} from '../../constants/sites';
import Icon from 'react-native-vector-icons/Ionicons';
import SiteToolBar from './SiteToolBar';

const styles = StyleSheet.create({
	container: {
		margin: 10,
		backgroundColor: "#fefefe",
	},
	titleText: {
		flex: 19,
		color: siteColor.dashboardTitleText,
		fontSize: 18
	},
	forwardArrow: {
		flex: 1,
		marginLeft: 10
	}
});

class Site extends Component {
	titleStyle = () => {
		let backgroundColor = this.props.siteData.type === siteType.PROJECT ? siteColor.projectTitleBackground : siteColor.courseTitleBackground;

		return {
			height: 35,
			flex: 1,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			paddingLeft: 5,
			backgroundColor
		};
	};

	constructor(props) {
		super(props);
	}

	hasForums = () => {
		return Object.keys(this.props.siteData.tools).indexOf("sakai.forums") > -1;
	};


	render() {

		return (
			<View style={styles.container}
						elevation={2}>
				<View style={this.titleStyle()} ref="title">
					<Text style={styles.titleText}
								ellipsizeMode="tail"
								numberOfLines={1}>
						{this.props.siteData.name}
					</Text>
					<Icon name="ios-arrow-forward"
								size={18}
								color="white"
								style={styles.forwardArrow}/>
				</View>
				<SiteToolBar color={this.titleStyle().backgroundColor} forums={this.hasForums()}/>
			</View>
		);
	}
}

export default Site;