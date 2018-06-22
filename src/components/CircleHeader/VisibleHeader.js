import React, {Component} from 'react'
import styled, {withTheme} from 'styled-components'
import {Animated} from "react-native"
import LinearGradient from 'react-native-linear-gradient'

const Container = styled(Animated.View)`
		position: absolute;
		top: 0;
		height: ${props => props.visibleHeight}px;
		width: 100%;
		background-color: ${props => props.theme.header};
		zIndex: 2;
		justify-content: flex-end;
		shadow-color: ${props => props.theme.darkText};
		shadow-opacity: 0.5;
		shadow-offset: 0px 2px;
		shadow-radius: 2;
`;

const StyledImage = styled.Image`
	height: 100%;
	width: 100%;
`

const Overlay = styled(Animated.createAnimatedComponent(LinearGradient))`
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
`

class VisibleHeader extends Component {
	render() {
		const { scrollAnimation } = this.props
		return (
			<Container {...this.props} style={{transform: scrollAnimation.transform}}>
				<StyledImage {...this.props}
										 source={require('../../../img/old_main.jpg')}
										 blurRadius={2}
				/>
				<Overlay
					style={{opacity: scrollAnimation.opacity}}
					colors={['#501214', '#501214']}
				/>
			</Container>
		)
	}
}

export default withTheme(VisibleHeader)