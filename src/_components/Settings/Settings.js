import React, {Component} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import * as Storage from '../../utils/storage';
import Spacer from '../Helper/Spacer';
import SettingsItem from './SettingsItem';
import AppLaunch from '../../utils/applaunch';
import LogoutButton from './LogoutButton';
import {unregister} from '../../actions/registrar';
import {logout} from '../../actions/login';
import {clearSites} from '../../actions/sites';
import {Analytics} from '../../utils/analytics';
import CookieManager from 'react-native-cookies';
import {Toast} from '../../utils/toast';

const SPACER = "spacer";
const NOTIFICATIONS = "Notification Settings";
const ABOUT = "About the App";
const FEEDBACK = "Give us Feedback";
const SUPPORT = "TRACS Support";
const TXST_MOBILE = "Go to TXST Mobile";
const SPACER_COLOR = "#E9E9EF";
const SPACER_HEIGHT = 25;

class MenuItem {
	constructor(title, onPress) {
		this.title = title;
		if (onPress !== null) {
			this.onPress = onPress;
		}
	}
}

class Settings extends Component {
	constructor(props) {
		super(props);
		this.handleLogout = this.handleLogout.bind(this);
		this.spacerHeight = SPACER_HEIGHT;
		this.spacerColor = SPACER_COLOR;
		this.menuItems = [
			new MenuItem(SPACER, null),
			new MenuItem(NOTIFICATIONS, (event) => {
				if (props.isGuestAccount) {
					Toast.show("Guest accounts can't receive notifications", Toast.LENGTH.LONG);
				} else {
					Actions.notificationSettings();
				}
			}),
			new MenuItem(SPACER, null),
			new MenuItem(ABOUT, function (event) {
				Actions.about();
			}),
			new MenuItem(FEEDBACK, function (event) {
				Actions.feedback();
			}),
			new MenuItem(SUPPORT, function (event) {
				Actions.support();
			}),
			new MenuItem(SPACER, null),
			new MenuItem(TXST_MOBILE, function (event) {
				const texasStateURL = 'edu.txstate.mobileapp';
				AppLaunch.load(texasStateURL);
			}),
		];
		Analytics().setScreen('Settings', 'Settings');
	}

	static createMenuDOM(shouldBeTop, index, disabled, title, onPress) {
		return (
			<SettingsItem key={index}
										title={title}
										disabled={disabled}
										topItem={shouldBeTop}
										onPress={onPress}/>
		)
	}

	handleLogout() {
		Storage.credentials.reset();
		Storage.clear();
		CookieManager.clearAll().then(() => {
			this.props.unregister();
			this.props.userLogout();
		});

	};

	componentDidUpdate() {
		if (this.props.isLoggedIn === false) {
			Actions.login();
		}
	}

	render() {
		let menuDOM, lastItemWasSpacer;
		const menus = this.menuItems.map((item, index) => {
			switch (item.title) {
				case SPACER:
					lastItemWasSpacer = true;
					return (
						<Spacer key={index}
										height={this.spacerHeight}
										color={this.spacerColor}/>
					);
				default:
					let disabled = this.props.isGuestAccount && item.title === NOTIFICATIONS;
					menuDOM = Settings.createMenuDOM(lastItemWasSpacer, index, disabled, item.title, item.onPress);
					lastItemWasSpacer = false;
					return menuDOM;
			}
		});
		return (
			<View>
				{menus}
				<View style={{alignItems: 'center', marginTop: 48}}>
					<LogoutButton
						text="Logout"
						color="#501214"
						name="logout"
						onPress={this.handleLogout}
					/>
				</View>
			</View>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		isLoggedIn: state.login.isAuthenticated,
		hasSites: state.tracsSites.userSites.length > 0,
		isGuestAccount: state.registrar.isGuestAccount
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		clearSites: () => dispatch(clearSites()),
		userLogout: () => dispatch(logout()),
		unregister: () => dispatch(unregister())
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);