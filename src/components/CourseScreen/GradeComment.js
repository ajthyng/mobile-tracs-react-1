import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import {TouchableOpacity} from "react-native"
import styled, {withTheme} from 'styled-components'


const CommentContainer = styled(TouchableOpacity)`
	padding: 0 0 8px 8px;
	background-color: transparent;
	flex-direction: row;
	align-items: flex-end;
	justify-content: flex-end;
	align-self: flex-end;
`;

const CommentButton = styled(Icon)`
	font-size: 18px;
	color: ${props => props.theme.darkText};
	padding-left: 8px;
`;

const CommentText = styled.Text`
	font-size: 14px;
	color: ${props => props.theme.darkText};
`;

const GradeComment = (props) => (
	<CommentContainer onPress={props.onPress} style={props.style}>
		<CommentText>Comments</CommentText>
		<CommentButton name="comment"/>
	</CommentContainer>
)

GradeComment.defaultProps = {
	onPress: () => null,
	style: []
}

export default GradeComment