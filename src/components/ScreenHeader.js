import React, {Component} from 'react'
import styled, {withTheme} from 'styled-components'
import {Dimensions} from 'react-native'

const HeaderContainer = styled.View`
	height: 60px;
	width: ${props => props.width - 20}px;
	margin: 10px;
	align-items: center;
	justify-content: center;
	background-color: white;
	shadow-color: #363534;
	shadow-opacity: 0.5;
	shadow-offset: 0 2px;
	shadow-radius: 2px;
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
    const {title, subtitle} = this.props
    const {width} = Dimensions.get('window')
    return (
      <HeaderContainer width={width}>
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