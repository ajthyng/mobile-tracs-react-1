import React, {Component} from 'react';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/FontAwesome';

const StyledIcon = styled(Icon)`
  font-size: ${props => props.active ? 22 : 18}px;
  color: ${props => props.color};
  margin-bottom: -10px;
`;

class TabIcon extends Component {
	constructor(props) {
		super(props);
		switch(props.scene) {
			case 'Hidden':
				this.iconName = 'eye-slash';
				break;
			case 'Home':
				this.iconName = 'home';
				break;
			case 'Projects':
				this.iconName = 'folder';
				break;
			default:
				this.iconName = 'question'
		}
	}

	render() {
		return (
			<StyledIcon name={this.iconName} color={this.props.color} active={this.props.focused}/>
		);
	}
}

TabIcon.defaultProps = {
	focused: false,
	scene: 'default',
	color: 'white'
};

export default TabIcon;