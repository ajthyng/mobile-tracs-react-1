import React, {Component} from 'react';
import {Dimensions, SectionList, Text, View} from 'react-native';
import {connect} from 'react-redux';
import {getNotifications} from '../../actions/notifications';
import ActivityIndicator from '../Helper/ActivityIndicator';
import Announcement from './Announcement';
import SectionHeader from './SectionHeader';
import Discussion from './Discussion';
import SectionSeparator from './SectionSeparator';
import ItemSeparator from './ItemSeparator';

class NotificationView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			deviceWidth: Dimensions.get('window').width,
			forums: true,
			announcements: false
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
			console.log(result);a
		});
	}

	renderSectionHeader = ({section}) => {
		return <SectionHeader title={section.title}
													onToggle={section.onToggle}
													isOn={section.isOn}
		/>
	};

	render() {
		let sections = [{
			data: this.props.announcements,
			renderItem: ({item}) => {
				return <Announcement deviceWidth={this.state.deviceWidth}
														 title={item.id}
														 author="Mr. Pink"
														 read={item.read}
														 onPress={() => {console.log(`${item.id} pressed.`)}}
				/>
			},
			title: "Announcements",
			isOn: this.state.announcements,
			onToggle: (value) => {
				this.setState({
					announcements: value
				});
				console.log(`Switch is toggled ${value}.`)
			}
		}, {
			data: this.props.forums,
			renderItem: ({item}) => {
				return <Discussion deviceWidth={this.state.deviceWidth}
													 title={item.id}
													 author="Mr. Brown"
													 read={item.read}
				/>
			},
			title: "Forums",
			isOn: this.state.forums,
			onToggle: (value) => {
				this.setState({
					forums: value
				});
				console.log(`Switch is toggled ${value}.`)
			}
		}];
		if (!this.props.notificationsLoaded) {
			return (
				<View>
					<ActivityIndicator/>
				</View>
			);
		} else {
			return (
				<SectionList
					sections={sections}
					renderSectionHeader={this.renderSectionHeader}
					renderSectionFooter={() => <SectionSeparator/>}
					ItemSeparatorComponent={ItemSeparator}
				/>
			);
		}
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		notificationsLoaded: state.notifications.isLoaded,
		errorMessage: state.notifications.errorMessage,
		announcements: state.notifications.announcements || [],
		forums: state.notifications.forums
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		getNotifications: () => dispatch(getNotifications())
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationView);