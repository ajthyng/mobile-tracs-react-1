import React, { Component } from 'react'
import { TouchableOpacity, Animated } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import styled from 'styled-components'

const Container = styled(Animated.View)`
  flex-direction: row;
  align-items: center;
  height: 80px;
`

const BackButton = styled(Icon)`
  padding-left: 16px;
  font-size: 32px;
  color: ${props => props.theme.darkText};
`

const CommentScroll = styled.ScrollView`
  width: 85%;
  padding: 4px 16px;
`

const CommentText = styled.Text`
  color: ${props => props.theme.darkText};
  font-size: 14px;
`

class Comments extends Component {
  scrollView = React.createRef()

  flashScrollIndicators = () => {
    const { current: scrollView } = this.scrollView
    scrollView && scrollView.flashScrollIndicators()
  }

  render () {
    const { comment, onPress, style, theme } = this.props

    return (
      <Container style={style}>
        <TouchableOpacity onPress={onPress}>
          <BackButton name='ios-arrow-forward' />
        </TouchableOpacity>
        <CommentScroll
          innerRef={this.scrollView}
          bounces={false}
          indicatorStyle={theme.scrollIndicator}
        >
          <CommentText>{comment}</CommentText>
          <TouchableOpacity style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
          />
        </CommentScroll>
      </Container>
    )
  }
}

Comments.defaultProps = {
  comment: 'No comments posted',
  onPress: () => null
}

export default Comments
