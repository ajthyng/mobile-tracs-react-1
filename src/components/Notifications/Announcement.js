import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import TabIcon from '../TabBar/TabIcon';
import {connect} from 'react-redux';

const circleSize= 50;

class Announcement extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const styles = StyleSheet.create({
			container: {
				flexDirection: 'row',
				alignItems: 'center',
				padding: 5,
				width: this.props.deviceWidth,
				backgroundColor: "#BF4F51",
				height: 87.142
			},
			circle: {
				width: circleSize,
				height: circleSize,
				marginLeft: 5,
				marginRight: 5,
				backgroundColor: this.props.read ? "#075750" : "#757500",
				borderRadius: circleSize / 2,
				flexDirection: 'row',
				justifyContent: 'center',
				alignItems: 'center'
			},
			content: {
				backgroundColor: "#29AB87",
				flex: 1,
				padding: 5
			},
			titleText: {
				fontSize: 20,
				fontWeight: 'bold'
			},
			creatorText: {
				fontWeight: '300'
			}
		});

		return (
			<View style={styles.container}>
				<View style={styles.circle}>
					<TabIcon name="bullhorn" size={circleSize / 2} color="#8A8AFF"/>
				</View>
				<View style={styles.content}>
					<Text style={styles.titleText}
								numberOfLines={1}
								ellipsizeMode="tail">{this.props.topic || "Announcement title not found"}</Text>
					<Text style={styles.creatorText}
								numberOfLines={1}
								ellipsizeMode="tail">{`Created By: ${this.props.author || 'Anonymous' }`}</Text>
				</View>
			</View>
		);
	}
}

export default Announcement;