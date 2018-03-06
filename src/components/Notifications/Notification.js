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
import {Animated, Easing, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import {types} from '../../constants/notifications';
import Discussion from './Discussion';
import Announcement from './Announcement';
import Swipeout from 'react-native-swipeout';
import SwipeDelete from './SwipeDelete';
import {batchUpdateNotification, updateNotification} from '../../actions/notifications';

const styles = StyleSheet.create({
	emptyNotification: {
		height: 40,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'white'
	},
	emptyText: {
		fontSize: 16,
		color: '#363534'
	}
});

const notificationHeight = 70;

class Notification extends Component {

	deleteNotification = () => {
		this.animateOut().start((event) => {
			this.props.deleteNotification(this.props.notification);
		});
	};
	animateIn = () => {
		Animated.timing(this.height, {
			toValue: notificationHeight,
			duration: this.duration,
			easing: Easing.exp
		}).start();
	};
	animateOut = () => {
		return Animated.timing(this.height, {
			toValue: 0,
			duration: 300,
			easing: Easing.exp
		});
	};

	constructor(props) {
		super(props);
		this.delete = [{
			component: <SwipeDelete onDelete={this.deleteNotification}/>
		}];
		this.height = new Animated.Value(notificationHeight);
		//TODO: Figure out a better way to animate
		//this.height = new Animated.Value(0);
		this.duration = 500;
	}

	render() {
		let animatedStyle = {
			height: this.height
		};

		//TODO: Activate animation when improved
		//this.animateIn();

		if (this.props.emptyNotification) {
			return (
				<View style={styles.emptyNotification}>
					<Text style={styles.emptyText}>No new {this.props.type === types.ANNOUNCEMENT ? "announcements." : "forum posts."}</Text>
				</View>
			)
		}

		switch (this.props.type) {
			case types.ANNOUNCEMENT:
				return (
					<Animated.View style={animatedStyle}>
						<Swipeout right={this.delete}>
							<Announcement {...this.props.data} height={notificationHeight}/>
						</Swipeout>
					</Animated.View>
				);
			case types.FORUM:
				return (
					<Animated.View style={animatedStyle}>
						<Swipeout right={this.delete}>
							<Discussion {...this.props.data} height={notificationHeight}/>
						</Swipeout>
					</Animated.View>
				);
			default:
				return null;
		}
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		deleteNotification: (notification) => {
			let newNotif = {...notification};
			let oldNotif = {...notification};
			newNotif.seen = true;
			newNotif.cleared = true;
			dispatch(updateNotification(newNotif, oldNotif));
		}
	}
};

export default connect(null, mapDispatchToProps)(Notification);