import React, {Component} from 'react'
import {TouchableWithoutFeedback, TouchableOpacity, View, ScrollView, Animated} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import styled from 'styled-components'

const Container = styled(Animated.View)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: 80px;
  width: 100%;
`

const BackButton = styled(Icon)`
	margin-left: 8px;
	font-size: 32px;
`

const CommentText = styled.Text`
	color: #363534;
	align-self: flex-start;
	font-size: 14px;
	margin-left: 16px;
	margin-right: 16px;
`

class Comments extends Component {
	flashScrollIndicators = () => {
		this.scrollView.flashScrollIndicators()
	}

	render() {
		const {comment, onPress, style} = this.props

		return (
			<Container style={style}>
				<TouchableOpacity onPress={onPress}>
					<BackButton name='ios-arrow-forward' />
				</TouchableOpacity>
				<ScrollView ref={c => this.scrollView = c} bounces={false}>
					<CommentText>{comment}</CommentText>
					<TouchableOpacity style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0
					}}/>
				</ScrollView>
			</Container>
		)
	}
}

Comments.defaultProps = {
	comment: 'No comments posted',
	onPress: () => null
}

export default Comments