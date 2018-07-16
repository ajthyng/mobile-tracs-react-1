import React, {Component} from 'react'
import {StatusBar, Platform} from 'react-native'
import styled, {withTheme} from 'styled-components'
import {connect} from 'react-redux'
import {setFilter} from '../../actions/sites'

import StatusBarSpace from './StatusBarSpace'
import Content from './Content'
import AdditionalContent from './AdditionalContent'

const HeaderContainer = styled.View`
	background-color: transparent;
	align-items: center;
  justify-content: center;
  width: 100%;
`

const setSiteFilter = (on) => {
	const favoritesFilter = (favorites) => (site) => favorites.contains(site.id)
	const noFilter = (favorites) => (site) => true

	return on ? noFilter : favoritesFilter
}

class Header extends Component {
	constructor(props) {
		super(props)
		StatusBar.setBarStyle('light-content')

		if (global.android) {
			StatusBar.setBackgroundColor(props.theme.header)
		}

		this.statusBarHeight = Platform.select({
			ios: 20,
			android: StatusBar.currentHeight
		})

		this.state = {
			allSitesFilter: false
		}
	}

	getActiveRouteName = (navigationState) => {
		if (!navigationState) {
			return null;
		}
		const route = navigationState.routes[navigationState.index];

		if (route.routes) {
			return this.getActiveRouteName(route);
		}
		console.log(route)
		return route.routeName;
	}

	onValueChange = (on) => {
		this.setState({allSitesFilter: on})
		this.props.setFilter(setSiteFilter(on))
	}

	render() {
		const currentRoute = this.getActiveRouteName(this.props.navigation.state)
		const {allSitesFilter} = this.state

		if (global.android && currentRoute === 'TRACSWeb') return null

		return (
			<HeaderContainer>
				<StatusBarSpace statusBarHeight={this.statusBarHeight} />
				<Content {...this.props}/>
				<AdditionalContent
					allSitesFilter={allSitesFilter}
					visible={currentRoute === 'Home'}
					onValueChange={this.onValueChange}
				/>
			</HeaderContainer>
		)
	}
}

const mapDispatchToProps = dispatch => ({
	setFilter: filter => dispatch(setFilter(filter))
})

export default connect(null, mapDispatchToProps)(withTheme(Header))