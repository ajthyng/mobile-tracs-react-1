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
const spacerColor = "#E9E9EF";

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
		this.spacerHeight = 25;
		this.spacerColor = spacerColor;
		this.menuItems = [
			new MenuItem(SPACER, null),
			new MenuItem(NOTIFICATIONS, function(event) { console.log(this.title); }),
			new MenuItem(SPACER, null),
			new MenuItem(ABOUT, function(event) { console.log(this.title); }),
			new MenuItem(FEEDBACK, function(event) { console.log(this.title); }),
			new MenuItem(SUPPORT, function(event) { console.log(this.title); }),
			new MenuItem(SPACER, null),
			new MenuItem(TXST_MOBILE, function(event) { console.log(this.title); }),
		];
	}

	static createMenuDOM(shouldBeTop, index, title, onPress) {
		return (
			<SettingsItem key={index}
										title={title}
										topItem={shouldBeTop}
										onPress={onPress}/>
		)
	}

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
					menuDOM = Settings.createMenuDOM(lastItemWasSpacer, index, item.title, item.onPress);
					lastItemWasSpacer = false;
					return menuDOM;
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