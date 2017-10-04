import React, {Component} from 'react';
import {ListView} from 'react-native';
import {connect} from 'react-redux';
import {getSiteInfo} from '../../actions/sites';

import Site from './Site';

class SiteList extends Component {
	constructor(props) {
		super(props);

	}

	componentDidMount() {
		const sitesNotLoaded = !this.props.isFetchingSites && Object.keys(this.props.sites).length === 0;
		if (sitesNotLoaded) {
			console.log("Calling memberships...");
			this.getMemberships(this.props.netid);
		}
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
		dataSource: dataSource.cloneWithRows(state.tracsSites.userSites)
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		getMemberships: (netid) => dispatch(getSiteInfo(netid))
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(SiteList);