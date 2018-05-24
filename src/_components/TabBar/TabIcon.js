import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import {site} from '../../constants/colors';

const BADGE_SIDE = 15;
const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 5
	},
	badge: {
		backgroundColor: site.badgeColor,
		height: BADGE_SIDE,
		width: BADGE_SIDE,
		borderRadius: BADGE_SIDE / 2,
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center'
	},
	badgeText: {
		marginBottom: 1,
		color: "#fff",
		fontSize: 10,
		fontWeight: 'bold'
	}
});

class TabIcon extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let platformStyle = global.android ? {top: 0, left: '12%'} : {right: -5, bottom: 0};
		let badge = (
			<View style={[styles.badge, platformStyle]}>
				<Text style={styles.badgeText}>{this.props.badgeCount}</Text>
			</View>
		);
		return (
			<View style={styles.container}>
				<Icon name={this.props.name} size={this.props.size} color={this.props.color}/>
				{this.props.badgeCount > 0 ? badge : null}
			</View>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	let announceCount = 0;
	if (ownProps.name === 'bullhorn') {
		announceCount = state.notifications.badgeCounts ? state.notifications.badgeCounts.announceCount : 0;
	}
	return {
		badgeCount: announceCount
	}
};

export default connect(mapStateToProps, null)(TabIcon);