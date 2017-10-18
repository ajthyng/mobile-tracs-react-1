import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Button, View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import * as Storage from '../../utils/storage';
import Spacer from '../Helper/Spacer';
import SettingsItem from './SettingsItem';

const SPACER = "spacer";
const NOTIFICATIONS = "Notification Settings";
const ABOUT = "About the App";
const FEEDBACK = "Give us Feedback";
const SUPPORT = "TRACS Support";
const TXST_MOBILE = "Go to TXST Mobile";

class Settings extends Component {
	constructor(props) {
		super(props);
		this.spacerHeight = 25;
		this.spacerColor = '#e9e9ef';
		this.menuItems = [
			SPACER,
			NOTIFICATIONS,
			SPACER,
			ABOUT,
			FEEDBACK,
			SUPPORT,
			SPACER,
			TXST_MOBILE
		];
	}

	componentDidUpdate() {
		if (this.props.isLoggedIn === false) {
			Actions.login();
		}
	}

	static createMenuItem(shouldBeTop, index, title, onPress) {
		return (
			<SettingsItem key={index}
										title={title}
										topItem={shouldBeTop}
										onPress={onPress} />
		)
	}

	render() {
		let menuItem;
		const menus = this.menuItems.map((item, index) => {
			switch(item) {
				case SPACER:
					lastItemWasSpacer = true;
					return (
						<Spacer key={index}
										height={this.spacerHeight}
										color={this.spacerColor} />
					);
				case NOTIFICATIONS:
					const notificationOnPress = (event) => {
						console.log(NOTIFICATIONS);
					};
					menuItem = Settings.createMenuItem(lastItemWasSpacer, index, NOTIFICATIONS, notificationOnPress);
					lastItemWasSpacer = false;
					return menuItem;
				case ABOUT:
					const aboutOnPress = (event) => {
						console.log(ABOUT);
					};
					menuItem = Settings.createMenuItem(lastItemWasSpacer, index, ABOUT, aboutOnPress);
					lastItemWasSpacer = false;
					return menuItem;
				case FEEDBACK:
					const feedbackOnPress = (event) => {
						console.log(FEEDBACK);
					};
					menuItem = Settings.createMenuItem(lastItemWasSpacer, index, FEEDBACK, feedbackOnPress);
					lastItemWasSpacer = false;
					return menuItem;
				case SUPPORT:
					const supportOnPress = (event) => {
						console.log(SUPPORT);
					};
					menuItem = Settings.createMenuItem(lastItemWasSpacer, index, SUPPORT, supportOnPress);
					lastItemWasSpacer = false;
					return menuItem;
				case TXST_MOBILE:
					const txstOnPress = (event) => {
						console.log(TXST_MOBILE);
					};
					menuItem = Settings.createMenuItem(lastItemWasSpacer, index, TXST_MOBILE, txstOnPress);
					lastItemWasSpacer = false;
					return menuItem;
			}
		});
		return (
			<View>
				{menus}
				<View style={{margin: 32}}>
					<Button title="Logout"
									onPress={() => {
										Storage.credentials.reset();
										this.props.clearSites();
										this.props.userLogout();
									}} />
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