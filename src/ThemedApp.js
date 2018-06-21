import React, {Component} from 'react'
import styled, {ThemeProvider} from 'styled-components'
import {SafeAreaView} from "react-native"
import {Scenes} from './scenes/Scenes'
import {connect} from 'react-redux'

const SafeStyled = styled(SafeAreaView)`
	flex: 1;
	background-color: ${props => props.theme.header};
`

class ThemedApp extends Component {
	render() {
		const { theme } = this.props
		return (
			<ThemeProvider theme={theme}>
				<SafeStyled>
					<Scenes/>
				</SafeStyled>
			</ThemeProvider>
		)
	}
}

const mapStateToProps = state => ({
	theme: state.theme
})

export default connect(mapStateToProps, null)(ThemedApp)