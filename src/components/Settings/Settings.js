import React, {Component} from 'react';
import {Button, Text, View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {logout} from '../../actions/login';
import {clearSites} from '../../actions/sites';
import * as Storage from '../../utils/storage';

class Settings extends Component {
	constructor(props) {
		super(props);
	}

	componentDidUpdate() {
		if (this.props.isLoggedIn === false) {
			Actions.login();
		}
	}

	render() {
		return (
			<View>
				<Text>Hello from {this.props.title}!</Text>
				<View style={{margin: 32}}>
					<Button title="Logout"
									onPress={() => {
										Storage.credentials.reset();
										this.props.clearSites();
										this.props.userLogout();
									}}/>
				</View>
			</View>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		isLoggedIn: state.login.isLoggedIn,
		hasSites: state.tracsSites.userSites.length > 0
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		clearSites: () => dispatch(clearSites()),
		userLogout: () => dispatch(logout())
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);