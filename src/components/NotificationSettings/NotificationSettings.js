import React, {Component} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';

import ActivityIndicator from '../Helper/ActivityIndicator';
import SettingSwitchControl from './SettingSwitchControl';
import Spacer from '../Helper/Spacer';
import {getRemoteSettings, getSettings, saveLocalSettings, saveRemoteSettings} from '../../actions/settings';
import {setCurrentScene} from '../../actions/routes';

import {types} from '../../constants/notifications';

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
	}

	createSettingDOM(isTop, index, setting, onPress) {
		const blacklist = this.props.settings.blacklist;
		console.log(blacklist);
		setting.enabled = true;

		blacklist.forEach((entry) => {
			if (entry.keys.object_type === setting.id || entry.other_keys.site_id === setting.id) {
				setting.enabled = false;
			}
		});
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
		this.props.setScene(Actions.currentScene);
		this.props.getSettings(this.props.token);
	}

	componentWillUpdate(nextProps) {
		console.log(nextProps);
	}

	createSpacerDOM(setting, index) {
		return (
			<Spacer height={this.spacerHeight}
							color={this.spacerColor}
							label={setting.name}
							key={index}
			/>
		)
	}

	render() {
		if (this.props.isFetchingSettings === true) {
			return (
				<ActivityIndicator/>
			)
		}

		const onPress = (enabled, self) => {
			self.setState({switchIsOn: enabled});
			const userSettings = this.props.settings;
			switch (self.props.id) {
				case ANNOUNCEMENT:
				case FORUM:
					userSettings.setType(self.props.id, enabled);
					break;
				default:
					userSettings.setSite(self.props.id, enabled);
					break;
			}
			this.props.saveLocalSettings(this.props.settings);
			this.props.saveRemoteSettings(this.props.settings, this.props.token);
		};

		const offset = this.settings.length;
		let nextSettingIsTop = false;

		let switches = this.settings.map((setting, index) => {
			switch (setting.type) {
				case SPACER:
					nextSettingIsTop = true;
					return this.createSpacerDOM(setting, index);
					break;
				case SETTING:
					let settingDOM = this.createSettingDOM(nextSettingIsTop, index, setting, onPress);
					nextSettingIsTop = false;
					return settingDOM;
					break;
				default:
					return;
			}
		});

		switches = [
			...switches,
			...Object.keys(this.props.sites).map((siteID, index) => {
				const site = this.props.sites[siteID];
				return this.createSettingDOM(index === 0, index + offset, site, onPress);
			})
		];

		return (
			<View>
				{switches}
			</View>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		sites: state.tracsSites.userSites,
		token: state.register.deviceToken,
		settings: state.settings.userSettings,
		isFetchingSettings: state.settings.isFetching
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		setScene: (scene) => dispatch(setCurrentScene(scene)),
		getSettings: (token) => dispatch(getRemoteSettings(token)),
		saveLocalSettings: (settings) => dispatch(saveLocalSettings(settings)),
		saveRemoteSettings: (settings, token) => dispatch(saveRemoteSettings(settings, token))
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationSettings);