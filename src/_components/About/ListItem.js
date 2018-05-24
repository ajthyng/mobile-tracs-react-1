import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class ListItem extends Component {
	constructor(props) {
		super(props);
	}

	styles = StyleSheet.create({
		container: {
			flexDirection: 'row',
			alignItems: 'center',
			backgroundColor: 'transparent',
			justifyContent: 'flex-start',
			width: '100%',
			marginTop: 20
		},
		itemText: {
			color: this.props.textColor || '#fff',
			fontSize: this.props.textSize || 28,
			paddingLeft: 15,
			textAlign: 'left',
			width: '85%'
		}
	});

	render() {
		return (
			<View style={this.styles.container}>
				<Icon name={this.props.name || "question"} size={this.props.iconSize || 28} color={this.props.iconColor || "#404040"}/>
				<Text style={this.styles.itemText}>{this.props.itemText || "No description found"}</Text>
			</View>
		);
	}
}

export default ListItem;