import React, {Component} from 'react'
import styled from 'styled-components'
import Ripple from 'react-native-material-ripple'

const CourseButtonContainer = styled.View`
	height: 65px;
	background-color: ${props => props.theme.transparent};
	align-items: center;
	justify-content: center;
`

const Button = styled(Ripple)`
	height: 50px;
	width: 200px;
	background-color: ${props => props.theme.viewCourseButton};
	align-items: center;
	justify-content: center;
`

const CourseButtonText = styled.Text`
	font-size: 20px;
	font-weight: bold;
	color: white;
`
class CourseButton extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		const {title, onPress} = this.props
		return (
			<CourseButtonContainer>
				<Button onPress={onPress}>
					<CourseButtonText>{title}</CourseButtonText>
				</Button>
			</CourseButtonContainer>
		)
	}
}

CourseButton.defaultProps = {
	title: 'Course',
	onPress: () => null
}

export default CourseButton