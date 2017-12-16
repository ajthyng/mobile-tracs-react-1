import React, {Component} from 'react';
import {BackHandler, Dimensions, Platform, SectionList, ToastAndroid} from 'react-native';
import {connect} from 'react-redux';
import {getNotifications} from '../../actions/notifications';
import {Actions} from 'react-native-router-flux';
import Notification from './Notification';
import SectionHeader from './SectionHeader';
import SectionSeparator from './SectionSeparator';
import ItemSeparator from './ItemSeparator';
import ActivityIndicator from '../Helper/ActivityIndicator';
import {getSettings, saveSettings} from '../../actions/settings';
import Settings from '../../utils/settings';
import {types} from '../../constants/notifications';
import {announcements} from '../../constants/scenes';
import DashboardHeader from './DashboardHeader'
import {Swipeout} from 'react-native-swipeout';

class NotificationView extends Component {
	renderSectionHeader = ({section}) => {
		switch (section.type) {
			case types.FORUM:
			case types.ANNOUNCEMENT:
				return (<SectionHeader title={section.title}
															 onToggle={section.onToggle}
															 isOn={section.isOn}
				/>);
			default:
				return null;
		}
	};
	getNotifications = (getSettings = false) => {
		console.log(`Loading Notifications: ${this.props.loadingNotifications ? "true" : "false"}`);
		if (!this.props.loadingNotifications) {
			this.setState({
				isRefreshing: true
			});
			let start = new Date();
			let promises = [
				this.props.getNotifications(),
				getSettings ? this.props.getSettings() : null
			];

			Promise.all(promises).then(result => {
				this.setState({
					isRefreshing: false
				});
				console.log(`Get Notifications: ${new Date() - start}`);
			});
		}
	};
	settingsChanged = (nextProps) => {
		const announceChange = nextProps.announcementSetting !== this.props.announcementSetting;
		const forumChange = nextProps.forumSetting !== this.props.forumSetting;

		return announceChange || forumChange;
	};
	filterNotifications = () => {
		if (this.props.siteData) {
			if (this.props.renderAnnouncements) {
				this.announcements = this.props.announcements.filter(announce => {
					return announce.other_keys.site_id === this.props.siteData.id;
				});
			}

			if (this.props.renderForums) {
				this.forums = this.props.forums.filter(post => {
					return post.other_keys.site_id === this.props.siteData.id;
				});
			}
		} else {
			this.announcements = this.props.announcements;
		}
	};
	setupNotificationSections = () => {
		this.filterNotifications();
		this.announcementSection = {
			data: this.props.announcementSetting ? this.announcements : [],
			renderItem: this.renderAnnouncement,
			title: "Announcements",
			type: types.ANNOUNCEMENT,
			isOn: this.props.announcementSetting,
			onToggle: this.toggleSetting(types.ANNOUNCEMENT)
		};

		this.forumSection = {
			data: this.props.forumSetting ? this.forums || [] : [],
			renderItem: this.renderForum,
			title: "Forums",
			type: types.FORUM,
			isOn: this.props.forumSetting,
			onToggle: this.toggleSetting(types.FORUM)
		};
	};
	toggleSetting(type) {
		return (value) => {
			let userSettings = new Settings({
				blacklist: this.props.blacklist,
				global_disable: this.props.global_disable
			});
			userSettings.setType(type, value);
			this.props.saveSettings(userSettings.getSettings(), this.props.token, false);
		};
	};
	renderForum = ({item}) => {
		if (!item) return null;
		let author = item.tracs_data.authoredBy;
		author = author.split(' ');
		author.splice(author.length - 1, 1);
		let data = {
			deviceWidth: this.state.deviceWidth,
			topic: item.tracs_data.topic_title,
			thread: item.tracs_data.title,
			author: author.join(' '),
			read: item.read
		};
		return <Notification type={types.FORUM}
												 notification={item}
												 data={data}/>
	};
	renderAnnouncement = ({item}) => {
		if (!item) return null;
		let data = {
			deviceWidth: this.state.deviceWidth,
			title: item.tracs_data.title,
			author: item.tracs_data.createdByDisplayName,
			read: item.read,
			onPress: () => {
				console.log(`${item.id} pressed`)
			}
		};
		return <Notification type={types.ANNOUNCEMENT}
												 notification={item}
												 data={data}/>
	};

	constructor(props) {
		super(props);
		this.state = {
			deviceWidth: Dimensions.get('window').width,
			isRefreshing: true,
			firstLoad: true
		};

		this.handleBack = this.handleBack.bind(this);
	}

	componentWillMount() {
		Dimensions.addEventListener('change', (dimensions) => {
			this.setState({
				deviceWidth: dimensions.window.width
			});
		});
		BackHandler.addEventListener('hardwareBackPress', this.handleBack);
		this.getNotifications(true);
		this.setupNotificationSections();
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.notificationsLoaded && this.state.firstLoad) {
			this.setState({
				firstLoad: false
			});
		}

		if (nextProps.notificationsLoaded && this.settingsChanged(nextProps)) {
			this.getNotifications(true);
		}

		if (nextProps.errorMessage) {
			if (Platform.OS === 'android') {
				ToastAndroid.show(nextProps.errorMessage, ToastAndroid.LONG);
			}
		}
		this.setupNotificationSections();
	}

	componentWillUnmount() {
		Dimensions.removeEventListener('change', (result) => {
			console.log(result);
		});
		BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
	}

	handleBack() {
		Actions.pop();
	}

	shouldComponentUpdate(nextProps, nextState) {
		console.log(`Announcements is ${nextProps.route === announcements ? "active" : "inactive"}.`);
		return nextProps.route === announcements;
	}

	render() {
		let sections = [];
		if (this.props.renderAnnouncements && this.announcementSection) {
			sections.push(this.announcementSection);
		}
		if (this.props.renderForums && this.forumSection) {
			sections.push(this.forumSection);
		}

		if (!this.props.notificationsLoaded && this.state.firstLoad) {
			return (
				<ActivityIndicator/>
			);
		} else {
			let dashboard = null;
			if (this.props.renderDashboard === true) {
				dashboard = <DashboardHeader siteName={this.props.siteData.name}
																		 contactName={this.props.siteData.contactInfo.name}
																		 contactEmail={this.props.siteData.contactInfo.email}/>
			}
			return (
				<SectionList
					sections={sections}
					keyExtractor={(item, index) => {
						return item.id
					}}
					onRefresh={this.getNotifications}
					refreshing={false}
					renderSectionHeader={this.renderSectionHeader}
					ListHeaderComponent={dashboard}
					renderSectionFooter={() => <SectionSeparator/>}
					ItemSeparatorComponent={ItemSeparator}
				/>
			);
		}

	}
}

const mapStateToProps = (state, ownProps) => {
	let announcementSetting = true;
	let forumSetting = true;

	state.settings.userSettings.blacklist.forEach(setting => {
		if (setting.keys.object_type === "discussion" && forumSetting) {
			forumSetting = false;
		} else if (setting.keys.object_type === "announcement" && announcementSetting) {
			announcementSetting = false;
		}
	});
	console.log(state.routes);
	return {
		notificationsLoaded: state.notifications.isLoaded,
		dispatchToken: state.registrar.deviceToken,
		loadingNotifications: state.notifications.isLoading,
		errorMessage: state.notifications.errorMessage,
		announcements: state.notifications.announcements || [],
		forums: state.notifications.forums || [],
		blacklist: state.settings.userSettings.blacklist,
		global_disable: state.settings.userSettings.global_disable,
		route: state.routes.scene,
		announcementSetting,
		forumSetting,
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		getNotifications: () => dispatch(getNotifications()),
		getSettings: () => dispatch(getSettings()),
		saveSettings: (settings, token, local) => dispatch(saveSettings(settings, token, local))
	}
};

NotificationView.defaultProps = {
	renderAnnouncements: true,
	renderForums: false,
	renderDashboard: false
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationView);