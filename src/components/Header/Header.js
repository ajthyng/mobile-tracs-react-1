import React, {Component} from 'react'
import {StatusBar, Platform} from 'react-native'
import styled, {withTheme} from 'styled-components'

import StatusBarSpace from './StatusBarSpace'
import Content from './Content'
import AdditionalContent from './AdditionalContent'

const HeaderContainer = styled.View`
	background-color: transparent;
	align-items: center;
  justify-content: center;
  width: 100%;
`

class Header extends Component {
	constructor(props) {
		super(props)
		StatusBar.setBarStyle('light-content')
		this.statusBarHeight = Platform.select({
			ios: 20,
			android: StatusBar.currentHeight
		})
	}

	getActiveRouteName = (navigationState) => {
		if (!navigationState) {
			return null;
		}
		const route = navigationState.routes[navigationState.index];

		if (route.routes) {
			return getActiveRouteName(route);
		}
		return route.routeName;
	}

	render() {
		const currentRoute = this.getActiveRouteName(this.props.navigation.state)

		return (
			<HeaderContainer>
				<StatusBarSpace statusBarHeight={this.statusBarHeight} />
				<Content {...this.props}/>
				<AdditionalContent visible={currentRoute === 'Home'}/>
			</HeaderContainer>
		)
	}
}

export default withTheme(Header)