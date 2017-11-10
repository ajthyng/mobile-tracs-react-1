import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {connect} from 'react-redux';
import {getNotifications} from '../../actions/notifications';
import ActivityIndicator from '../Helper/ActivityIndicator';

class Notifications extends Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		if (!this.props.loadingNotifications) {
			this.props.getNotifications();
			this.setState({})
		}
	}

	render() {
		if (this.props.loadingNotifications) {
			return (
				<View>
					<ActivityIndicator/>
				</View>
			);
		} else {
			return (
				<View>
					<Text>Hello from {this.props.title}</Text>
				</View>
			);
		}
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		loadingNotifications: state.notifications.isLoading,
		errorMessage: state.notifications.errorMessage
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		getNotifications: () => dispatch(getNotifications())
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);