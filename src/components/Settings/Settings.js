import React, {Component} from 'react';
import {Button, Text, View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {logout} from '../../actions/login';

class Settings extends Component {
	constructor(props) {
		super(props);
	}

	componentWillReceiveProps(newProps) {
		if (!newProps.isLoggedIn) {
			Actions.login();
		}
	}

	render() {
		return (
			<View>
				<Text>Hello from {this.props.title}!</Text>
				<View style={{margin: 32}}>
					<Button title="Logout"
									onPress={() => this.props.userLogout()}/>
				</View>
			</View>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		isLoggedIn: state.login.isLoggedIn
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		userLogout: () => dispatch(logout())
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);