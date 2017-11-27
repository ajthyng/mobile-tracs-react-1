import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import TabIcon from '../TabBar/TabIcon';
import Icon from 'react-native-vector-icons/Ionicons';

import {notification} from '../../constants/colors';
import Ripple from 'react-native-material-ripple';

const circleSize = 50;

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
				backgroundColor: notification.background,
				height: 87.142
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
			titleText: {
				fontSize: 20,
				fontWeight: 'bold',
				paddingRight: 5
			},
			creatorText: {
				fontWeight: '300',
				paddingRight: 5
			},
			forwardArrow: {
				paddingRight: 5
			}
		});

		return (
			<Ripple onPress={this.props.onPress} rippleDuration={600}>
				<View style={styles.container}>
					<View style={styles.circle}>
						<TabIcon name="bullhorn" size={circleSize / 2}
										 color={this.props.read ? notification.readIcon : notification.unreadIcon}/>
					</View>
					<View style={styles.content}>
						<Text style={styles.titleText}
									numberOfLines={1}
									ellipsizeMode="tail">{this.props.title || "Announcement title not found"}</Text>
						<Text style={styles.creatorText}
									numberOfLines={1}
									ellipsizeMode="tail">{`Created By: ${this.props.author || 'Anonymous' }`}</Text>
					</View>
					<Icon name="ios-arrow-forward"
								size={24}
								color={notification.forwardArrow}
								style={styles.forwardArrow}/>
				</View>
			</Ripple>
		);
	}
}

export default Announcement;