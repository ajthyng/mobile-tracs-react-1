import React, {Component} from 'react';
import {ToastAndroid, BackHandler, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';

import ActivityIndicator from '../Helper/ActivityIndicator';
import SettingSwitchControl from './SettingSwitchControl';
import Spacer from '../Helper/Spacer';
import {getSettings, saveSettings} from '../../actions/settings';
import {setCurrentScene} from '../../actions/routes';

import {types} from '../../constants/notifications';
import {settings as SETTINGS} from '../../constants/scenes';
import Settings from '../../utils/settings';
import {Analytics} from '../../utils/analytics';

const SPACER_COLOR = "#E9E9EF";
const SPACER_HEIGHT = 35;
const SPACER = "spacer";
const SETTING = "setting";
const {ANNOUNCEMENT, FORUM} = types;

class NotificationSettings extends Component {
	constructor(props) {
		super(props);
		this.spacerHeight = SPACER_HEIGHT;
		this.spacerColor = SPACER_COLOR;

		this.settings = [{
			type: SPACER,
			name: "Notification Types"
		}, {
			type: SETTING,
			id: ANNOUNCEMENT,
			name: "Announcements"
		}, {
			type: SETTING,
			id: FORUM,
			name: "Forums"
		}];

		if (Object.keys(props.sites).length > 0) {
			this.settings.push({
				type: SPACER,
				name: "Courses"
			});
		}
		Analytics().setCurrentScreen('NotificationSettings', 'NotificationSettings');
	}

	createSettingDOM(isTop, index, setting, onPress) {
		const blacklist = this.props.blacklist;
		setting.enabled = true;

		if (blacklist) {
			blacklist.forEach((entry) => {
				if (entry.keys.object_type === setting.id || entry.other_keys.site_id === setting.id) {
					setting.enabled = false;
				}
			});
		}
		return (
			<SettingSwitchControl key={index}
														title={setting.name}
														id={setting.id}
														topItem={isTop}
														enabled={setting.enabled}
														onChange={onPress}/>
		)
	}

	componentWillMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBack);
		this.props.setScene(Actions.currentScene);
		this.props.getSettings(this.props.token);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
	}

	handleBack = () => {
		Actions.pop();
		return true;
	};

	createSpacerDOM(setting, index) {
		return (
			<Spacer height={this.spacerHeight}
							color={this.spacerColor}
							label={setting.name}
							key={index}
			/>
		)
	}

	saveSettings(settings, token, local) {
		if (local) {
			return new Promise((resolve) => {
				this.props.saveSettings(settings, token, local);
				resolve(true);
			});
		} else {
			return new Promise((resolve) => {
				this.props.saveSettings(settings, token, local).then(didSave => {
					resolve(didSave);
				});
			});
		}
	}

	render() {
		if (this.props.isFetching === true || !this.props) {
			return (
				<ActivityIndicator/>
			)
		} else {
			const onPress = async (enabled, self) => {
				self.setState({switchIsOn: enabled});

				const userSettings = new Settings({
					blacklist: this.props.blacklist,
					global_disable: this.props.global_disable
				});
				switch (self.props.id) {
					case ANNOUNCEMENT:
					case FORUM:
						userSettings.setType(self.props.id, enabled);
						break;
					default:
						userSettings.setSite(self.props.id, enabled);
						break;
				}
				await this.saveSettings(userSettings.getSettings(), this.props.token, false)
					.then(result => {
						if (!result) self.setState({switchIsOn: !self.state.switchIsOn});
					});
			};

			const offset = this.settings.length;
			let nextSettingIsTop = false;

			let defaultSwitches = this.settings.map((setting, index) => {
				switch (setting.type) {
					case SPACER:
						nextSettingIsTop = true;
						return this.createSpacerDOM(setting, index);
					case SETTING:
						let settingDOM = this.createSettingDOM(nextSettingIsTop, index, setting, onPress);
						nextSettingIsTop = false;
						return settingDOM;
					default:
						return;
				}
			});

			let siteSwitches = Object.keys(this.props.sites).map((siteID, index) => {
				const site = this.props.sites[siteID];
				return this.createSettingDOM(index === 0, index + offset, site, onPress);
			});

			defaultSwitches = [
				...defaultSwitches,
				...siteSwitches
			];

			if (this.props.errorMessage) {
				ToastAndroid.show(this.props.errorMessage, ToastAndroid.LONG);
			}

			return (
				<ScrollView>
					{defaultSwitches}
				</ScrollView>
			);
		}
	}

}

const mapStateToProps = (state, ownProps) => {
	return {
		sites: state.tracsSites.userSites,
		token: state.registrar.deviceToken,
		blacklist: state.settings.userSettings.blacklist,
		global_disable: state.settings.userSettings.global_disable,
		errorMessage: state.settings.errorMessage,
		isFetching: state.settings.isFetching
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		setScene: (scene) => dispatch(setCurrentScene(scene)),
		getSettings: (token) => dispatch(getSettings(token)),
		saveSettings: (settings, token, local) => dispatch(saveSettings(settings, token, local)),
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationSettings);