import React, {Component} from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class TabIcon extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View>
				<Icon name={this.props.name} size={this.props.size} color={this.props.color}/>
			</View>
		);
	}
}

export default TabIcon;