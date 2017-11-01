import React, {Component} from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {clearSites, getSiteInfo} from '../../actions/sites';
import * as location from '../../utils/location';
import Site from './Site';
import {setCurrentScene} from '../../actions/routes';
import {auth, netidLogout} from '../../actions/login';

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
	}

	componentDidUpdate() {
		if (location.compare(Actions.currentScene, this.props.currentScene)) {
			this.checkComponentState();

			if (this.props.siteFetchFailed === true) {
				this.clearSites();
			}
		}
	}

	checkComponentState() {
		const sitesNotLoaded = this.props.isFetchingSites === false && Object.keys(this.props.sites).length === 0;
		if (sitesNotLoaded) {
			this.getMemberships(this.props.netid);
		}
		if (this.props.isLoggedIn === false) {
			Actions.login();
		}
	}

	clearSites() {
		this.props.clearSites();
	}

	login(netid, password) {
		this.props.onLogin(netid, password);
	}

	logout() {
		this.props.onLogout();
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
		return (
			<FlatList
				data={this.props.dataSource}
				renderItem={(site) => {
					return (
						<Site siteData={site.item.info}/>
					);
				}}
				refreshControl={
					<RefreshControl
						refreshing={this.state.refreshing}
						onRefresh={this.onRefresh.bind(this)}/>
				}
		/>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	let siteData = [];
	Object.keys(state.tracsSites.userSites).forEach(site => {
		const userSite = state.tracsSites.userSites[site];
		siteData.push({key: userSite.id, info: userSite})
	});
	return {
		netid: state.login.netid,
		isLoggedIn: state.login.isLoggedIn,
		deviceToken: state.register.deviceToken,
		sites: state.tracsSites.userSites,
		isFetchingSites: state.tracsSites.isFetchingSites,
		dataSource: siteData,
		currentScene: state.routes.scene
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		getMemberships: (netid) => dispatch(getSiteInfo(netid)),
		clearSites: () => dispatch(clearSites()),
		setScene: (scene) => dispatch(setCurrentScene(scene)),
		onLogin: (netid, password) => dispatch(auth(netid, password)),
		onLogout: () => dispatch(netidLogout())
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(SiteList);