import React, {Component} from 'react'
import {TouchableOpacity} from 'react-native'
import styled from 'styled-components'
import Icon from 'react-native-vector-icons/FontAwesome'

const TitleContainer = styled.View`
	height: 65px;
	background-color: ${props => props.theme.transparent};
	flex-direction: row;
	align-items: center;
	justify-content: center;
`

const CourseName = styled.Text`
	flex: 1;
	color: ${props => props.theme.darkText};
	margin-left: 8px;
	font-size: 18px;
`

const CloseIcon = styled(Icon)`
	width: 65px;
	text-align: right;
	font-size: 36px;
	color: ${props => props.theme.darkText};
	padding-right: 8px;
`

class Title extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		const {name, dismiss} = this.props

		return (
			<TitleContainer>
				<CourseName>{name}</CourseName>
				<TouchableOpacity onPress={dismiss}>
					<CloseIcon name='close' size={36} />
				</TouchableOpacity>
			</TitleContainer>
		)
	}
}

Title.defaultProps = {
	name: 'Course name not found'
}

export default Title