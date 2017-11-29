import React, {Component} from 'react';
import {Dimensions, SectionList} from 'react-native';
import {connect} from 'react-redux';
import {getNotifications} from '../../actions/notifications';
import Announcement from './Announcement';
import SectionHeader from './SectionHeader';
import Discussion from './Discussion';
import SectionSeparator from './SectionSeparator';
import ItemSeparator from './ItemSeparator';
import ActivityIndicator from '../Helper/ActivityIndicator';

class NotificationView extends Component {
	renderSectionHeader = ({section}) => {
		return <SectionHeader title={section.title}
													onToggle={section.onToggle}
													isOn={section.isOn}
		/>
	};
	getNotifications = () => {
		if (!this.props.loadingNotifications) {
			this.setState({
				isRefreshing: true
			});
			this.props.getNotifications().then(result => {
				this.setState({
					isRefreshing: false
				});
			});
		}
	};

	constructor(props) {
		super(props);
		this.state = {
			deviceWidth: Dimensions.get('window').width,
			forums: true,
			announcements: false,
			isRefreshing: true,
			firstLoad: true
		};
	}

	componentWillMount() {
		Dimensions.addEventListener('change', (dimensions) => {
			this.setState({
				deviceWidth: dimensions.window.width
			});
		});
	}

	componentDidMount() {
		this.getNotifications();
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.notificationsLoaded && this.state.firstLoad) {
			this.setState({
				firstLoad: false,
			});
		}
	}

	componentWillUnmount() {
		Dimensions.removeEventListener('change', (result) => {
			console.log(result);
		});
	}

	render() {
		let sections = [{
			data: this.props.announcements || [],
			renderItem: ({item}) => {
				return <Announcement deviceWidth={this.state.deviceWidth}
														 title={item.tracs_data.title}
														 author={item.tracs_data.createdByDisplayName}
														 read={item.read}
														 onPress={() => {
															 console.log(`${item.id} pressed.`)
														 }}
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
			data: this.props.forums || [],
			renderItem: ({item}) => {
				let author = item.tracs_data.authoredBy;
				author = author.split(' ');
				author.splice(author.length - 1, 1);
				return <Discussion deviceWidth={this.state.deviceWidth}
													 topic={item.tracs_data.topic_title}
													 thread={item.tracs_data.title}
													 author={author.join(' ')}
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
		if (!this.props.notificationsLoaded && this.state.firstLoad) {
			return (
				<ActivityIndicator/>
			);
		} else {
			return (
				<SectionList
					sections={sections}
					keyExtractor={(item, index) => {
						return item.id
					}}
					onRefresh={this.getNotifications}
					refreshing={this.state.isRefreshing}
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