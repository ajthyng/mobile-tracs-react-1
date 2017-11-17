import React, {Component} from 'react';
import {View, Dimensions, SectionList} from 'react-native';
import {connect} from 'react-redux';
import {getNotifications} from '../../actions/notifications';
import ActivityIndicator from '../Helper/ActivityIndicator';
import Discussion from './Discussion';
import Announcement from './Announcement';

class NotificationView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			deviceWidth: Dimensions.get('window').width
		};
	}

	componentWillMount() {
		if (!this.props.loadingNotifications) {
			this.props.getNotifications();
		}
		Dimensions.addEventListener('change', (dimensions) => {
			this.setState({
				deviceWidth: dimensions.window.width
			});
		});
	}

	componentWillUnmount() {
		Dimensions.removeEventListener('change', (result) => {
			console.log(result);
		});
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
					<Announcement read={false}
												title="This is my announcement of important things that need to be shown to all students at once"
											deviceWidth={this.state.deviceWidth}
					/>
					<Discussion topic="We were looking for a topic to discuss but we couldn't come to an agreeable consensus"
											read={false}
											deviceWidth={this.state.deviceWidth}
					/>
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

export default connect(mapStateToProps, mapDispatchToProps)(NotificationView);