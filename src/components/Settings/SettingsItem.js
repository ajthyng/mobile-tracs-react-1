import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';

class SettingsItem extends Component {
	constructor(props) {
		super(props);
	}

	getStyle() {
		borderColor = "#000000";
		borderWidth = StyleSheet.hairlineWidth;
		return StyleSheet.create({
			container: {
				borderTopWidth: this.props.topItem === true ? borderWidth : 0,
				borderBottomWidth: borderWidth,
				borderTopColor: borderColor,
				borderBottomColor: borderColor
			},
			label: {
				textAlign: 'left',
				color: '#000',
				fontSize: 15,
				padding: 10
			},
			labelBack: {
				backgroundColor: '#ffffff',
			}
		})
	}

	onPressSetting(info) {
		if (typeof this.props.onPress === 'function') {
			this.props.onPress(info);
		}
	}

	render() {
		return (
			<TouchableOpacity onPress={this.onPressSetting.bind(this)}
												activeOpacity={0.6}>
				<View style={this.getStyle().container}>
					<View style={this.getStyle().labelBack}>
						<Text style={this.getStyle().label}>{this.props.title}</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		//Object mapping state variables to props variables
		//netid: state.register.registeredUser
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		//Object mapping action functions to props as functions
		//getMemberships: () => dispatch(getSiteInfo())        
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsItem);