import React, {Component} from 'react'
import styled from 'styled-components'

const Container = styled.View`
	height: ${props => props.statusBarHeight};
	width: 100%;
	background-color: ${props => props.theme.header};
`


class StatusBarSpace extends Component {
	render() {
		return global.ios ? (
			<Container {...this.props} />
		) : null
	}
}

export default StatusBarSpace