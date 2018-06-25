import React, {Component} from 'react'
import styled, {ThemeProvider} from 'styled-components'
import {SafeAreaView} from 'react-navigation'
import {Scenes} from './scenes/Scenes'
import {connect} from 'react-redux'
import {DeviceInfo, Dimensions, NativeModules, Platform} from 'react-native'
import {MenuProvider} from 'react-native-popup-menu'

const SafeStyled = styled(SafeAreaView)`
	flex: 1;
	background-color: ${props => props.theme.header};
`

const X_WIDTH = 375
const X_HEIGHT = 812

const {PlatformConstants = {}} = NativeModules
const {height: D_HEIGHT, width: D_WIDTH} = Dimensions.get('window')
const {minor = 0} = PlatformConstants.reactNativeVersion || {}

const isIPhoneX = (() => {
	if (Platform.OS === 'web') return false

	if (minor >= 50) {
		return DeviceInfo.isIPhoneX_deprecated
	}

	return (
		Platform.OS === 'ios' &&
		((D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) ||
			(D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT))
	)
})()

class ThemedApp extends Component {
	render() {
		const {theme} = this.props

		return (
			<ThemeProvider theme={theme}>
				<MenuProvider customStyles={{
					backdrop: {backgroundColor: 'black', opacity: 0.5}
				}}>
					{
						(() => isIPhoneX ?
								<SafeStyled forceInset={{bottom: 'never'}}>
									<Scenes/>
								</SafeStyled> : <Scenes/>
						)()
					}
				</MenuProvider>
			</ThemeProvider>
		)
	}
}

const mapStateToProps = state => ({
	theme: state.theme
})

export default connect(mapStateToProps, null)(ThemedApp)