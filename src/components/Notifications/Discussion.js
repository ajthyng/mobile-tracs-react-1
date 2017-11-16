import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import TabIcon from '../TabBar/TabIcon';

const circleSize = 50;

class Discussion extends Component {
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
				backgroundColor: "#BF4F51"
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
			topicText: {
				fontSize: 20,
				fontWeight: 'bold'
			},
			threadText: {
				fontSize: 16,
				fontWeight: '400'
			},
			authorText: {
				fontWeight: '300'
			}
		});

		return (
			<View style={styles.container} onLayout={(event) => {
				console.log(event.nativeEvent.layout);
			}}>
				<View style={styles.circle}>
					<TabIcon name="comments" size={circleSize / 2} color="#8A8AFF"/>
				</View>
				<View style={styles.content}>
					<Text style={styles.topicText}
								numberOfLines={1}
								ellipsizeMode="tail">{this.props.topic || "Topic title not found"}</Text>
					<Text style={styles.threadText}
							  numberOfLines={1}
								ellipsizeMode="tail">{this.props.thread || "Conversation title not found"}</Text>
					<Text style={styles.authorText}
								numberOfLines={1}
								ellipsizeMode="tail">{`Posted By: ${this.props.author || 'Anonymous' }`}</Text>
				</View>
			</View>
		);
	}
}

export default Discussion;