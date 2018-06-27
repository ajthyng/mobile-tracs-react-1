import React, {Component} from 'react'
import {StatusBar} from 'react-native'
import styled, {withTheme} from 'styled-components'
import {setHeaderState} from '../actions/header'
import { connect } from 'react-redux'
import { getSettings } from '../actions/settings'

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: ${props => props.theme.viewBackground};
`

const globalSettings = [
	{name: 'Dark Theme', initial: 'off'},
	{name: 'Holiday Theme', initial: 'off'}
]

const notificationSettings = [
	{name: 'All Announcements', initial: 'on'},
	{name: 'All Forum Posts', initial: 'on'}
]

class SettingsScreen extends Component {
	constructor(props) {
		super(props)
		this.courseSettings = []
	}

	componentDidMount () {
		this.props.getSettings()
	}

	render() {
		return (
			<Container/>
		)
	}
}

const mapDispatchToProps = (dispatch, props) => ({
	setHeaderState: (isCollapsed) => {
		if (isCollapsed !== props.isCollapsed) {
			dispatch(setHeaderState(isCollapsed))
		}
	},
	getSettings: () => dispatch(getSettings(props.token))
})

const mapStateToProps = state => ({
	isCollapsed: state.header.isCollapsed,
	token: state.registrar.deviceToken
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(SettingsScreen))