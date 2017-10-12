import React, {Component} from 'react';
import {ListView} from 'react-native';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {clearSites, getSiteInfo} from '../../actions/sites';
import * as location from '../../utils/location';
import Site from './Site';
import {setCurrentScene} from '../../actions/routes';

class SiteList extends Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		this.props.setScene(Actions.currentScene);
	}

	componentDidUpdate() {
		if (location.compare(Actions.currentScene, this.props.currentScene)) {
			this.checkComponentState();
		}
	}

	checkComponentState() {
		const sitesNotLoaded = this.props.isFetchingSites === false && Object.keys(this.props.sites).length === 0;
		if (sitesNotLoaded) {
			this.getMemberships(this.props.netid);
		}
		if (this.props.isLoggedIn === false) {
			this.clearSites();
		}
	}

	clearSites() {
		this.props.clearSites();
	}

	getMemberships(netid) {
		this.props.getMemberships(netid);
	}

	render() {
		return (
			<ListView
				enableEmptySections={true}
				dataSource={this.props.dataSource}
				renderRow={siteData => {
					return (
						<Site siteData={siteData}/>
					);
				}}
			/>
		);
	}
}

const dataSource = new ListView.DataSource({
	rowHasChanged: (prevRowData, nextRowData) => {
		return prevRowData !== nextRowData;
	}
});

const mapStateToProps = (state, ownProps) => {
	return {
		netid: state.register.registeredUser,
		isLoggedIn: state.login.isLoggedIn,
		deviceToken: state.register.deviceToken,
		sites: state.tracsSites.userSites,
		isFetchingSites: state.tracsSites.isFetchingSites,
		dataSource: dataSource.cloneWithRows(state.tracsSites.userSites),
		currentScene: state.routes.scene
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