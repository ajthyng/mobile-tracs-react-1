import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {site as siteColor} from '../../constants/colors';
import {types as siteType} from '../../constants/sites';
import Icon from 'react-native-vector-icons/Ionicons';
import SiteToolBar from './SiteToolBar';
import Ripple from 'react-native-material-ripple';

const styles = StyleSheet.create({
	container: {
		margin: 10,
		backgroundColor: "#fff",
	},
	titleText: {
		flex: 19,
		fontSize: 15
	},
	forwardArrow: {
		flex: 1,
		marginLeft: 10
	}
});

class Site extends Component {
	titleStyle = () => {
		let backgroundColor = this.isCourse ? siteColor.courseTitleBackground : siteColor.projectTitleBackground;

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
		this.isCourse = this.props.siteData.type === siteType.COURSE;
	}

	render() {
		let textColor = {
			color: this.isCourse ? '#fff' : '#222'
		};
		return (
			<View style={styles.container}
						elevation={2}>
				<Ripple onPress={this.props.siteData.onPress || (() => {
				})}>
					<View style={this.titleStyle()} ref="title">
						<Text style={[styles.titleText, textColor]}
									ellipsizeMode="tail"
									numberOfLines={1}>
							{this.props.siteData.name}
						</Text>
						<Text style={[textColor, {marginLeft: 20}]}>
							Site
						</Text>
						<Icon name="ios-arrow-forward"
									size={18}
									color="white"
									style={[styles.forwardArrow, textColor]}/>
					</View>
				</Ripple>
				<SiteToolBar color={siteColor.toolBarColor} siteData={this.props.siteData}/>
			</View>
		);
	}
}

export default Site;