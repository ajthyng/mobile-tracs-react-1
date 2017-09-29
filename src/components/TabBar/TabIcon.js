import React, {Component} from 'react';
import {View} from 'react-native';

class TabIcon extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View>
				{this.props.title}
			</View>
		);
	}
}

export default TabIcon;