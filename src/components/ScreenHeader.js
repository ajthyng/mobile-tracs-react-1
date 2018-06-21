import React, {Component} from 'react'
import styled, {withTheme} from 'styled-components'
import Header from './CircleHeader/Header'
import Icon from 'react-native-vector-icons/FontAwesome'
import Ripple from 'react-native-material-ripple'

const HeaderContainer = styled.View`
	height: 60px;
	margin-top: ${Header.HEIGHT};
	width: 100%;
	align-items: center;
	justify-content: center;
	border-bottom-color: ${props => props.theme.screenHeaderBorder};
	border-bottom-width: 1px;
`

const BackArrow = styled(Icon)`
	font-size: 28px;
	color: ${props => props.theme.darkText};
`

const BackArrowContainer = styled(Ripple)`
	position: absolute;
	top: 0;
	bottom: 0;
	padding-left: 16px;
	padding-right: 16px;
	align-items: center;
	justify-content: center;
	left: 0;
`

const TitleContainer = styled.View`
	align-items: center;
	justify-content: center;
`

const Title = styled.Text`
	color: ${props => props.theme.darkText};
	font-size: 22px;
`

const Subtitle = styled.Text`
	color: ${props => props.theme.darkText};
	font-size: 16px;
`

class ScreenHeader extends Component {
	render() {
		const { title, subtitle } = this.props

		return (
			<HeaderContainer style={this.props.style}>
				<BackArrowContainer onPress={() => this.props.navigation.goBack()}>
					<BackArrow name='chevron-left' />
				</BackArrowContainer>
				<TitleContainer>
					<Title>{title}</Title>
					<Subtitle>{subtitle}</Subtitle>
				</TitleContainer>
			</HeaderContainer>
		)
	}
}

ScreenHeader.defaultProps = {
	title: 'No title set',
	subtitle: 'No subtitle set'
}

export default withTheme(ScreenHeader)