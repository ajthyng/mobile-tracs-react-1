import React, {Component} from 'react';
import {Picker, SectionList} from 'react-native';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {clearSites, getSiteInfo} from '../../actions/sites';
import Site from './Site';
import {setCurrentScene} from '../../actions/routes';
import {auth, netidLogout} from '../../actions/login';
import {types as siteTypes} from '../../constants/sites';

class SiteList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			...this.state,
			refreshing: false
		}
	}

	componentWillMount() {
		this.props.setScene(Actions.currentScene);
		this.checkComponentState();
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
		const sitesNotLoaded = this.props.isFetchingSites === false && Object.keys(this.props.userSites).length === 0;
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
		sites.projects = this.props.sites.filter((site) => {
			return site.info.type === siteTypes.PROJECT;
		});
		sites.courses = this.props.sites.filter((site) => {
			return site.info.type === siteTypes.COURSE;
		});

		let sections = [
			{
				data: sites.courses,
				renderItem: ({item}) => {
					return (
						<Site siteData={item.info}/>
					)
				}
			}, {
				data: sites.projects,
				renderItem: ({item}) => {
					return (
						<Site siteData={item.info}/>
					)
				}
			}
		];
		return (
			<SectionList
				style={{backgroundColor: "#D2CCC3"}}
				sections={sections}
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
		netid: state.login.netid,
		isAuthenticated: state.login.isAuthenticated,
		deviceToken: state.registrar.deviceToken,
		userSites: state.tracsSites.userSites,
		isFetchingSites: state.tracsSites.isFetchingSites,
		currentScene: state.routes.scene,
		sites
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		getMemberships: (netid) => dispatch(getSiteInfo(netid)),
		clearSites: () => dispatch(clearSites()),
		setScene: (scene) => dispatch(setCurrentScene(scene))
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(SiteList);