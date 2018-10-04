import React, { Component } from 'react'
import { TouchableOpacity, Animated } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import styled from 'styled-components'

const Container = styled(Animated.View)`
  flex-direction: row;
  height: 80px;
  background-color: white;
  width: 100%;
  margin: 3px;
`

const BackButton = styled(Icon)`
  padding: 0 16px;
  font-size: 32px;
  color: ${props => props.theme.darkText};
`

const CommentScroll = styled.ScrollView`

`

const CommentText = styled.Text`
  color: ${props => props.theme.darkText};
  font-size: 14px;
  padding-right: 8px;
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
        <TouchableOpacity onPress={onPress} style={{ alignSelf: 'stretch', justifyContent: 'center' }}>
          <BackButton name='ios-arrow-forward' />
        </TouchableOpacity>
        <CommentScroll
          innerRef={this.scrollView}
          bounces={false}
          indicatorStyle={theme.scrollIndicator}
          contentContainerStyle={{ width: '100%' }}
        >
          <CommentText>{comment}</CommentText>
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
