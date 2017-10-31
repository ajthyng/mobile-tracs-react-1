import React, {Component} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import SettingSwitchControl from './SettingSwitchControl';
import Spacer from '../Helper/Spacer';

const SPACER_COLOR = "#E9E9EF";
const SPACER_HEIGHT = 35;
const SPACER = "spacer";
const SETTING = "setting";

class NotificationSettings extends Component {
	constructor(props) {
		super(props);
		this.spacerHeight = SPACER_HEIGHT;
		this.spacerColor = SPACER_COLOR;
	}

	static createSettingDOM(isTop, index, title, onPress) {
		return (
			<SettingSwitchControl key={index}
														title={title}
														topItem={isTop}
														onChange={onPress}/>
		)
	}

	createSpacerDOM(label, index) {
		return (
			<Spacer height={this.spacerHeight}
							color={this.spacerColor}
							label={label}
							key={index}
			/>
		)
	}

	render() {
		let siteIDs = Object.keys(this.props.sites);
		const settings = [{
			name: SPACER,
			label: "Notification Types"
		}, {
			name: SETTING,
			label: "Announcements"
		}, {
			name: SETTING,
			label: "Forums"
		}];
		if (siteIDs.length > 0) {
			settings.push({
				name: SPACER,
				label: "Courses"
			})
		}

		const onPress = function (value, self) {
			self.setState({switchIsOn: value});
			console.log(`${self.props.title} is turned ${value === true ? "on" : "off"}.`)
		};

		const offset = settings.length;
		let nextSettingIsTop = false;

		let switches = settings.map((setting, index) => {
			switch (setting.name) {
				case SPACER:
					nextSettingIsTop = true;
					return this.createSpacerDOM(setting.label, index);
					break;
				case SETTING:
					let settingDOM = NotificationSettings.createSettingDOM(nextSettingIsTop, index, setting.label, onPress);
					nextSettingIsTop = false;
					return settingDOM;
					break;
				default:
					return;
			}
		});
		switches = [
			...switches,
			...siteIDs.map((siteID, index) => {
				const site = this.props.sites[siteID];
				return NotificationSettings.createSettingDOM(index === 0, index + offset, site.name, onPress);
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
		sites: state.tracsSites.userSites
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		//Object mapping action functions to props as functions
		//getMemberships: () => dispatch(getSiteInfo())
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationSettings);