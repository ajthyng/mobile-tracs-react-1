import React, {Component} from 'react'
import styled from 'styled-components'
import CalendarIcon from '../CircleHeader/CalendarIcon'
import ProfileMenu from '../ProfileMenu/ProfileMenu'
import {HeaderBackButton} from 'react-navigation'

const Container = styled.View`
	height: 63px;
	width: 100%;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	background-color: ${props => props.theme.header};
	padding-left: ${props => props.canGoBack ? 0 : 16}px;
	padding-right: 16px;
`

const BackButton = (props) => (
	<HeaderBackButton {...props} />
)

const CalendarButton = (props) => (
	<CalendarIcon
		{...props}
		size={28}
		onPress={props.goToCalendar}
	/>
)

class Content extends Component {
	goToCalendar = () => {
		this.props.navigation.navigate('Calendar', {transition: 'cardFromBottom'})
	}

	render() {
		const {navigation} = this.props
		const canGoBack = navigation.state.index > 0

		const previousRoute = (navigation.state.routes[navigation.state.index - 1] || {}).routeName

		const leftButton = canGoBack ?
			<BackButton
				tintColor='white'
				title={previousRoute}
				onPress={() => {
					this.props.navigation.navigate(previousRoute)
					console.log(this.props)
				}}
			/> :
			<CalendarButton goToCalendar={this.goToCalendar} />

		return (
			<Container canGoBack={canGoBack}>
				{leftButton}
				<ProfileMenu navigation={navigation} />
			</Container>
		)
	}
}

export default Content