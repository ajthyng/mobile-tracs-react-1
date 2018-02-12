import React, {Component} from 'react';
import {Keyboard, SectionList, StatusBar, StyleSheet, Text} from 'react-native';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {clearSites, getSiteInfo} from '../../actions/sites';
import Site from './Site';
import {setCurrentScene} from '../../actions/routes';
import {auth, netidLogout} from '../../actions/login';
import {types as siteTypes} from '../../constants/sites';
import {getNotifications} from '../../actions/notifications';
import {site as siteColor} from '../../constants/colors';
import Workspace from './Workspace';
import {Analytics} from '../../utils/analytics';

const styles = StyleSheet.create({
	sectionHeader: {
		marginLeft: 10,
		marginTop: 10,
		fontSize: 12,
	}
});

class SiteList extends Component {
	countNotifications = (site) => {
		if ((this.props.badgeCounts || {}).hasOwnProperty(site.info.id)) {
			site.info.forumCount = this.props.badgeCounts[site.info.id].forumCount || 0;
			site.info.unseenCount = this.props.badgeCounts[site.info.id].unseenCount || 0;
		} else {
			site.info.forumCount = 0;
			site.info.unseenCount = 0;
		}
		return site;
	};

	siteOnPress = (site) => {
		let siteUrl = `${global.urls.baseUrl}${global.urls.webUrl}/${site.info.id}`;
		Analytics().logSiteClick(site.info.type, site.info.id);
		site.info.onPress = () => {
			Actions.push('tracsDashboard', {
				baseUrl: siteUrl
			});
		};
		return site;
	};

	constructor(props) {
		super(props);
		this.state = {
			...this.state,
			refreshing: false
		};
		Analytics().setUserId();
		Analytics().setCurrentScreen('Sites', 'SiteList');
		StatusBar.setBackgroundColor('#501214');
		StatusBar.setBarStyle('light-content');
	}

	componentWillMount() {
		this.props.setScene(Actions.currentScene);
		this.checkComponentState();
	}

	componentDidMount() {
		if (!this.props.isLoadingNotifications) {
			this.props.getNotifications(this.props.token);
		}
	}

	componentDidUpdate() {
		if (Actions.currentScene === 'sites' && !this.props.isFetchingSites) {
			this.checkComponentState();

			if (this.props.siteFetchFailed === true) {
				this.clearSites();
			}
		}
	}

	checkComponentState() {
		const sitesNotLoaded = this.props.isFetchingSites === false && this.props.hasSites === undefined;
		if (sitesNotLoaded) {
			this.getMemberships(this.props.netid);
		}
		if (!this.props.isAuthenticated) {
			Actions.login();
		}
	}

	clearSites() {
		this.props.clearSites();
	}

	getMemberships(netid) {
		this.props.getMemberships(netid);
	}

	onRefresh() {
		this.setState({refreshing: true});
		this.props.getMemberships(this.props.netid).then(() => {
			this.setState({refreshing: false});
		});
	}

	render() {
		let sites = {};
		Keyboard.dismiss();
		sites.projects = this.props.sites.filter((site) => {
			return site.info.type === siteTypes.PROJECT;
		});
		sites.courses = this.props.sites.filter((site) => {
			return site.info.type === siteTypes.COURSE;
		});

		sites.projects = sites.projects.map(this.countNotifications);
		sites.courses = sites.courses.map(this.countNotifications);

		sites.projects = sites.projects.map(this.siteOnPress);
		sites.courses = sites.courses.map(this.siteOnPress);

		let sections = [{
			data: [{
				owner: this.props.netid,
				key: 0
			}],
			type: 'workspace',
			renderItem: () => {
				return <Workspace owner={this.props.netid}/>
			}
		}, {
			data: sites.courses,
			type: 'courses',
			renderItem: ({item}) => {
				return (
					<Site siteData={item.info}/>
				)
			}
		}, {
			data: sites.projects,
			type: 'projects',
			renderItem: ({item}) => {
				return (
					<Site siteData={item.info}/>
				)
			}
		}
		];
		return (
			<SectionList
				style={{backgroundColor: siteColor.backgroundColor}}
				sections={sections}
				renderSectionHeader={({section}) => {
					let sectionHeader = null;
					if (section.data.length > 0) {
						if (section.type === 'courses') {
							sectionHeader = <Text style={styles.sectionHeader}>COURSES</Text>;
						} else if (section.type === 'projects') {
							sectionHeader = <Text style={styles.sectionHeader}>PROJECT</Text>;
						}
					}
					return sectionHeader;
				}}
				refreshing={this.state.refreshing}
				onRefresh={this.onRefresh.bind(this)}
			/>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	let sites = [];

	Object.keys(state.tracsSites.userSites).forEach(site => {
		const userSite = state.tracsSites.userSites[site];
		sites.push({key: userSite.id, info: userSite})
	});
	sites.sort((a, b) => {
		if (a.info.name > b.info.name) return 1;
		if (a.info.name < b.info.name) return -1;
		return 0;
	});
	return {
		announcements: state.notifications.announcements,
		isLoadingNotifications: state.notifications.isLoading,
		forums: state.notifications.forums,
		netid: state.login.netid,
		badgeCounts: state.notifications.badgeCounts,
		isAuthenticated: state.login.isAuthenticated,
		deviceToken: state.registrar.deviceToken,
		userSites: state.tracsSites.userSites,
		isFetchingSites: state.tracsSites.isFetchingSites,
		currentScene: state.routes.scene,
		hasSites: state.tracsSites.hasSites,
		sites
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		getMemberships: (netid) => dispatch(getSiteInfo(netid)),
		getNotifications: (token) => dispatch(getNotifications(token)),
		clearSites: () => dispatch(clearSites()),
		setScene: (scene) => dispatch(setCurrentScene(scene))
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(SiteList);