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
		margin: 5
	},
	badge: {
		backgroundColor: site.badgeColor,
		height: BADGE_SIDE,
		width: BADGE_SIDE,
		borderRadius: BADGE_SIDE / 2,
		top: -3,
		left: "12%",
		margin: 'auto',
		position: 'absolute',
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center'
	},
	badgeText: {
		marginBottom: 1,
		color: "#fff",
		fontSize: 12,
		fontWeight: 'bold'
	}
});

class TabIcon extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let badge = <View style={styles.badge}><Text style={styles.badgeText}>{this.props.badgeCount}</Text></View>;
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