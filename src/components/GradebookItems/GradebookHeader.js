import React, {Component} from 'react'
import styled from 'styled-components'
import Header from '../CircleHeader/Header'
import Icon from 'react-native-vector-icons/FontAwesome'
import Ripple from 'react-native-material-ripple'

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
`

const GradebookHeaderContainer = styled.View`
	height: 60px;
	margin-top: ${Header.HEIGHT};
	width: 100%;
	align-items: center;
	justify-content: center;
	border-bottom-color: #36353480;
	border-bottom-width: 1px;
`

const BackArrow = styled(Icon)`
	font-size: 28px;
	color: #363534;
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

const GradebookTitleContainer = styled.View`
	align-items: center;
	justify-content: center;
`

const GradebookTitle = styled.Text`
	color: #363534;
	font-size: 22px;
`

const GradebookSubtitle = styled.Text`
	color: #363534;
	font-size: 16px;
`

class GradebookHeader extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		const {courseName} = this.props

		return (
			<GradebookHeaderContainer>
				<BackArrowContainer>
					<BackArrow name='chevron-left' />
				</BackArrowContainer>
				<GradebookTitleContainer>
					<GradebookTitle>All Gradebook Items</GradebookTitle>
					<GradebookSubtitle>{courseName}</GradebookSubtitle>
				</GradebookTitleContainer>
			</GradebookHeaderContainer>
		)
	}
}

GradebookHeader.defaultProps = {
	courseName: 'Course Name Not Found'
}

export default GradebookHeader