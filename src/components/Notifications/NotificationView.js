import React, {Component} from 'react';
import {BackHandler, Dimensions, Platform, SectionList, Text, ToastAndroid, View} from 'react-native';
import {connect} from 'react-redux';
import {batchUpdateNotification, getNotifications} from '../../actions/notifications';
import {Actions} from 'react-native-router-flux';
import Notification from './Notification';
import SectionHeader from './SectionHeader';
import SectionSeparator from './SectionSeparator';
import ItemSeparator from './ItemSeparator';
import ActivityIndicator from '../Helper/ActivityIndicator';
import {getSettings, saveSettings} from '../../actions/settings';
import Settings from '../../utils/settings';
import {types} from '../../constants/notifications';
import {announcements, dashboard} from '../../constants/scenes';
import DashboardHeader from './DashboardHeader'
import {Swipeout} from 'react-native-swipeout';
import FCM from 'react-native-fcm';
import {Analytics} from '../../utils/analytics';

const UNPUBLISHED_SITE_NAME = "Unpublished Site";

class NotificationView extends Component {
	renderSectionHeader = ({section}) => {
		switch (section.type) {
			case types.FORUM:
			case types.ANNOUNCEMENT:
				if (this.props.renderDashboard === true) {
					return (<SectionHeader title={section.title}
																 onToggle={section.onToggle}
																 isOn={section.isOn}
					/>);
				}
				return null;
			default:
				return null;
		}
	};

	getNotifications = (getSettings = false) => {
		if (!this.props.loadingNotifications) {
			this.setState({
				isRefreshing: true
			});
			let promises = [
				this.props.getNotifications()
			];
			if (getSettings) {
				promises.push(this.props.getSettings());
			}

			Promise.all(promises).then(result => {
				this.setState({
					isRefreshing: false
				});
			});
		}
	};

	settingsChanged = (nextProps) => {
		const announceChange = nextProps.announcementSetting !== this.props.announcementSetting;
		const forumChange = nextProps.forumSetting !== this.props.forumSetting;
		const siteFilterChange = nextProps.filteredAnnouncementSites.length !== this.props.filteredAnnouncementSites.length;
		return announceChange || forumChange || siteFilterChange;
	};

	filterNotifications = (props) => {
		if (props.siteData) {
			if (props.renderAnnouncements) {
				this.announcements = props.announcements.filter(announce => announce.other_keys.site_id === props.siteData.id);
			}

			if (props.renderForums && props.forums) {
				this.forums = props.forums.filter(post => post.other_keys.site_id === props.siteData.id);
				this.forums.sort(this.sortByDate);
			}
		} else {
			this.announcements = props.announcements;
		}
		if ((this.announcements || []).length > 0) {
			this.announcements.sort(this.sortByDate);
		}
	};

	sortByDate = (a, b) => {
		let aDate = new Date(a.notify_after);
		let bDate = new Date(b.notify_after);
		return bDate - aDate;
	};

	setupNotificationSections = (props) => {
		this.filterNotifications(props);
		let id = null;
		if (this.props.siteData) {
			id = this.props.siteData.id;
		}
		this.announcementSection = {
			data: props.announcementSetting ? this.announcements || [] : [],
			renderItem: this.renderAnnouncement,
			title: "Announcements",
			type: types.ANNOUNCEMENT,
			isOn: props.announcementSetting,
			onToggle: this.toggleSetting(types.ANNOUNCEMENT, id)
		};

		this.forumSection = {
			data: props.forumSetting ? this.forums || [] : [],
			renderItem: this.renderForum,
			title: "Forums",
			type: types.FORUM,
			isOn: props.forumSetting,
			onToggle: this.toggleSetting(types.FORUM, id)
		};
		if (this.announcementSection.data.length === 0) {
			this.announcementSection.data = [{id: null}];
		}
		if (this.forumSection.data.length === 0) {
			this.forumSection.data = [{id: null}];
		}
	};

	renderForum = ({item}) => {
		if (!item) return null;
		if (item.id === null) {
			return (
				<Notification type={types.FORUM}
											emptyNotification={true}
				/>
			)
		}
		let author = item.tracs_data.authoredBy;
		author = author.split(' ');
		author.splice(author.length - 1, 1);
		let data = {
			deviceWidth: this.state.deviceWidth,
			topic: item.tracs_data.topic_title,
			thread: item.tracs_data.title,
			author: author.join(' '),
			read: item.read,
			onPress: () => {
				if (item.id === null) return;
				this.props.batchUpdate(item.id, {read: true});
				let toolPageId = "";
				if (this.props.siteData.tools.hasOwnProperty('sakai.forums')) {
					toolPageId = `${(((this.props.siteData || {}).tools['sakai.forums'] || {}).id || "")}`;
				}

				let forumUrl = `${global.urls.baseUrl}${global.urls.webUrl}${global.urls.getForumPage(this.props.siteData.id, toolPageId)}`;
				Actions.push('tracsDashboard', {
					baseUrl: forumUrl
				});
			}
		};
		return <Notification type={types.FORUM}
												 notification={item}
												 data={data}/>
	};

	renderAnnouncement = ({item}) => {
		if (!item) return null;
		if (item.id === null) {
			return (
				<Notification type={types.ANNOUNCEMENT}
											emptyNotification={true}
				/>
			)
		}
		let siteId = item.other_keys.site_id;
		let name = UNPUBLISHED_SITE_NAME;
		if (siteId && this.props.sites.hasOwnProperty(siteId)) {
			name = this.props.sites[siteId].name;
		}
		if (!item) return null;
		let siteIsUnpublished = name === UNPUBLISHED_SITE_NAME;
		let data = {
			deviceWidth: this.state.deviceWidth,
			title: item.tracs_data.title,
			author: item.tracs_data.createdByDisplayName,
			siteName: name,
			read: item.read,
			onPress: () => {
				if (item.id === null) return;
				if (!siteIsUnpublished) {
					this.props.batchUpdate([item.id], {read: true});
				}
				let sceneToCall = 'tracsAnnouncement';
				if (this.props.renderDashboard) {
					sceneToCall = 'tracsDashboard';
				}
				let siteId = (this.props.siteData || {}).id || item.other_keys.site_id || "";
				let toolPageId = ((((this.props.sites[siteId] || {}).tools || {})['sakai.announcements']) || {}).id || "";
				let announcementUrl = `${global.urls.baseUrl}${global.urls.webUrl}${global.urls.getAnnouncementPage(siteId, toolPageId)}`;

				Actions.push(sceneToCall, {
					baseUrl: announcementUrl
				});
			}
		};
		return <Notification type={types.ANNOUNCEMENT}
												 notification={item}
												 emptyNotification={item.id === null}
												 data={data}/>
	};

	constructor(props) {
		super(props);
		this.state = {
			deviceWidth: Dimensions.get('window').width,
			isRefreshing: true,
			firstLoad: true
		};

		this.forums = [];
		this.announcements = [];

		switch (this.props.route) {
			case 'announcements':
				Analytics().logAnnouncementsOpen();
				Analytics().setScreen('Announcements', 'NotificationView');
				break;
			case 'dashboard':
				if (props.renderAnnouncements === true) {
					Analytics().logDashboardOpen();
					Analytics().setScreen('Dashboard', 'NotificationView');
				} else {
					Analytics().logForumsOpen();
					Analytics().setScreen('Forums', 'NotificationView');
				}
				break;
			default:
				break;
		}
		this.batchUpdateSeen = this.batchUpdateSeen.bind(this);
		this.handleBack = this.handleBack.bind(this);
	}

	toggleSetting(type, id = null) {
		return (value) => {
			let userSettings = new Settings({
				blacklist: this.props.blacklist,
				global_disable: this.props.global_disable
			});
			if (id !== null) {
				userSettings.setTypeAndSite(type, id, value);
			} else {
				userSettings.setType(type, value);
			}

			this.props.saveSettings(userSettings.getSettings(), this.props.token, false);
		};
	};

	componentWillMount() {
		Dimensions.addEventListener('change', (dimensions) => {
			if (this.props.route === 'announcements' || this.props.route === 'dashboard') {
				this.setState({
					deviceWidth: dimensions.window.width
				});
			}
		});
		BackHandler.addEventListener('hardwareBackPress', this.handleBack);
		if (this.props.isGuestAccount === false) {
			let shouldGetSettings = this.props.route === 'dashboard';
			this.getNotifications(shouldGetSettings);
			this.setupNotificationSections(this.props);
		} else {
			this.setState({
				firstLoad: false,
				isRefreshing: false
			})
		}
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.notificationsLoaded && this.state.firstLoad) {
			this.setState({
				firstLoad: false
			});
		}

		if (nextProps.notificationsLoaded && this.settingsChanged(nextProps)) {
			let shouldGetSettings = this.props.route === 'announcements';
			this.getNotifications(shouldGetSettings);
		}

		if (nextProps.errorMessage) {
			if (Platform.OS === 'android') {
				ToastAndroid.show(nextProps.errorMessage, ToastAndroid.LONG);
			}
		}

		if (this.props.pending && !nextProps.pending && nextProps.success) {
			this.props.getSettings();
		}
		this.setupNotificationSections(nextProps);
	}

	componentWillUnmount() {
		Dimensions.removeEventListener('change', (result) => {
		});
		BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
	}

	handleBack() {
		Actions.pop();
		return true;
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.isGuestAccount === true) {
			return false;
		}

		if (nextProps.route === dashboard && this.props.renderDashboard) {
			return true;
		}

		if (nextProps.route === announcements && !this.props.renderDashboard) {
			return true;
		}

		return this.settingsChanged(nextProps);
	}

	render() {
		this.start = new Date();

		if (this.props.isGuestAccount && this.props.renderDashboard === false) {
			return (
				<View style={{height: 80, backgroundColor: "#fff", alignItems: 'center', justifyContent: 'center'}}>
					<Text style={{color: '#404040', fontSize: 16}}>
						Guest Accounts can't receive push notifications
					</Text>
				</View>
			);
		} else if (!this.props.notificationsLoaded && this.state.firstLoad && this.props.route === 'announcements') {
			return (
				<ActivityIndicator/>
			);
		} else {
			let dashboard = null;
			let sections = [];
			if (!this.props.isGuestAccount) {
				if (this.props.renderAnnouncements && this.announcementSection) {
					sections.push(this.announcementSection);
				}
				if (this.props.renderForums && this.forumSection) {
					sections.push(this.forumSection);
				}
			} else {
				let emptySection = {
					data: ["Guest accounts can't receive notifications"],
					renderItem: ({item}) => (
						<View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', height: 50}}>
							<Text style={{color: '#000', fontSize: 14}}>
								{item}
							</Text>
						</View>
					),
				};
				sections.push(emptySection);
			}

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
					onRefresh={this.props.isGuestAccount ? (() => {
					}) : this.getNotifications}
					refreshing={false}
					renderSectionHeader={this.renderSectionHeader}
					ListHeaderComponent={dashboard}
					renderSectionFooter={() => <SectionSeparator/>}
					ItemSeparatorComponent={ItemSeparator}
					maxToRenderPerBatch={30}
				/>
			);
		}

	}

	componentDidMount() {
		this.batchUpdateSeen();
	}

	componentDidUpdate() {
		this.batchUpdateSeen();
	}

	async batchUpdateSeen() {
		if (this.props.isGuestAccount === true) {
			return;
		}
		const status = {
			seen: true
		};

		let ids = [
			...this.announcementSection.data.filter(item => !item.seen).map(item => item.id),
			...this.forumSection.data.filter(item => !item.seen).map(item => item.id)
		];

		ids = ids.filter(id => id !== null);

		let token = this.props.dispatchToken || await FCM.getFCMToken().then(token => token);

		if (!this.props.isBatchUpdating && !this.props.errorMessage && ids.length > 0) {
			this.props.batchUpdate(ids, status, token);
		}
	}
}

const mapStateToProps = (state, ownProps) => {
	let announcementSetting = true;
	let forumSetting = true;
	let filteredAnnouncementSites = [];
	state.settings.userSettings.blacklist.forEach(setting => {
		let settingIsApplicableToThisSite = setting.hasOwnProperty('other_keys') &&
			ownProps.siteData && setting.other_keys.site_id === ownProps.siteData.id;

		let settingIsApplicableToAnnouncements = setting.hasOwnProperty('keys') &&
			setting.keys.object_type === 'announcement' &&
			Object.keys(setting.other_keys).length === 0;

		let settingIsApplicableToForums = setting.hasOwnProperty('keys') &&
			setting.keys.object_type === 'discussion' &&
			Object.keys(setting.other_keys).length === 0;

		if (setting.other_keys.site_id) {
			if (setting.keys.object_type === 'announcement') {
				filteredAnnouncementSites.push(setting.other_keys.site_id);
			}
		}

		if (settingIsApplicableToThisSite) {
			if (setting.hasOwnProperty("keys")) {
				if (setting.keys.object_type === "discussion") {
					forumSetting = false;
				}
				if (setting.keys.object_type === "announcement") {
					announcementSetting = false;
				}
			}
		} else if (settingIsApplicableToAnnouncements) {
			announcementSetting = false;
		} else if (settingIsApplicableToForums) {
			forumSetting = false;
		}
	});

	return {
		notificationsLoaded: state.notifications.isLoaded,
		dispatchToken: state.registrar.deviceToken,
		isBatchUpdating: state.notifications.isBatchUpdating,
		loadingNotifications: state.notifications.isLoading,
		errorMessage: state.notifications.errorMessage,
		announcements: state.notifications.announcements || [],
		forums: state.notifications.forums || [],
		blacklist: state.settings.userSettings.blacklist,
		global_disable: state.settings.userSettings.global_disable,
		route: state.routes.scene,
		sites: state.tracsSites.userSites,
		isGuestAccount: state.registrar.isGuestAccount,
		pending: state.settings.isSaving,
		success: state.settings.isSaved,
		announcementSetting,
		forumSetting,
		filteredAnnouncementSites
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		getNotifications: () => dispatch(getNotifications()),
		getSettings: () => dispatch(getSettings()),
		saveSettings: (settings, token, local) => dispatch(saveSettings(settings, token, local)),
		batchUpdate: (ids, status, token) => dispatch(batchUpdateNotification(ids, status, token))
	}
};

NotificationView.defaultProps = {
	renderAnnouncements: true,
	renderForums: false,
	renderDashboard: false
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationView);