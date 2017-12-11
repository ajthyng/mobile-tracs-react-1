import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import TabIcon from '../TabBar/TabIcon';

import {notification} from '../../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import Ripple from 'react-native-material-ripple';
import Swipeout from 'react-native-swipeout';

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
				backgroundColor: notification.background,
				borderRadius: 0,
				height: 88
			},
			circle: {
				width: circleSize,
				height: circleSize,
				marginLeft: 5,
				marginRight: 5,
				backgroundColor: this.props.read ? notification.readCircle : notification.unreadCircle,
				borderRadius: circleSize / 2,
				flexDirection: 'row',
				justifyContent: 'center',
				alignItems: 'center'
			},
			content: {
				backgroundColor: notification.background,
				flex: 1,
				padding: 5
			},
			topicText: {
				fontSize: 20,
				fontWeight: 'bold',
				paddingRight: 10
			},
			threadText: {
				fontSize: 16,
				fontWeight: '400',
				paddingRight: 5
			},
			authorText: {
				fontWeight: '300',
				paddingRight: 5
			},
			forwardArrow: {
				paddingRight: 5
			}
		});
		Ripple.defaultProps.rippleContainerBorderRadius = styles.container.borderRadius;
		return (
			<Swipeout right={[{text: "Delete"}]}>
				<Ripple onPress={this.props.onPress} rippleDuration={600}>
					<View style={styles.container}>
						<View style={styles.circle}>
							<TabIcon name="comments" size={circleSize / 2}
											 color={this.props.read ? notification.readIcon : notification.unreadIcon}/>
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
						<Icon name="ios-arrow-forward"
									size={24}
									color={notification.forwardArrow}
									style={styles.forwardArrow}/>
					</View>
				</Ripple>
			</Swipeout>
		);
	}
}

export default Discussion;