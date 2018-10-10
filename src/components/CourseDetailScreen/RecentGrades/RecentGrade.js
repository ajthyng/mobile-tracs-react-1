import React, { Component } from 'react'
import { Animated, View, TouchableWithoutFeedback, Dimensions } from 'react-native'
import styled from 'styled-components'
import Comments from './Comments'
import dayjs from 'dayjs'
import Grade from './Grade'
import GradeInfo from './GradeInfo'

const Container = styled(Animated.View)`
  height: 80px;
  flex-basis: 80px;
  margin: 3px;
  align-self: stretch;
  align-items: center;
  flex-direction: row;
  background-color: white;
`

const CommentBox = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 4;
  left: 95px;
`

const ViewComments = styled.Text`
  font-size: 14px;
  text-decoration: underline;
`

const Dot = styled.View`
  background-color: #AAAAAA;
  height: 10px;
  width: 10px;
  border-radius: 5px;
  margin-left: 6px;
  margin-top: 2px;
`

const Comment = ({ comment, onPress }) => {
  return comment
    ? (
      <React.Fragment>
        <ViewComments
          accessibilityLabel='read comments'
          accessibilityHint='opens comments for grade'
        >
          View Comments
        </ViewComments>
        <Dot />
      </React.Fragment>
    ) : null
}

class RecentGrade extends Component {
  constructor (props) {
    super(props)
    this.driver = new Animated.Value(0)
    this.comments = React.createRef()
    this.state = {
      commentVisible: false
    }
  }

  showComment = () => {
    this.animateComment(true)
  }

  hideComment = () => {
    this.animateComment(false)
  }

  animateComment = (showComment = true) => {
    Animated.timing(this.driver, {
      toValue: showComment ? 1 : 0,
      duration: 200,
      useNativeDriver: true
    }).start(() => {
      this.setState({ commentVisible: showComment })
      if (showComment) {
        this.comments.current && this.comments.current.flashScrollIndicators()
      }
    })
  }

  render () {
    const { grade, name, points, comment, postedDate } = this.props
    const { commentVisible } = this.state
    const { width } = Dimensions.get('window')

    const translateX = this.driver.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -width]
    })

    const opacity = this.driver.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1]
    })

    const translateCommentX = this.driver.interpolate({
      inputRange: [0, 1],
      outputRange: [width, 0]
    })

    return (
      <View style={{ overflow: 'hidden' }}>
        <Container
          accessibilityElementsHidden={commentVisible}
          style={{ transform: [{ translateX: translateX }], opacity }}
        >
          <Grade
            earned={grade}
            total={points}
            hasComment={comment !== null}
          />
          <GradeInfo
            earned={grade}
            posted={postedDate}
            hasComment={comment !== null}
            name={name}
            onShowComment={this.showComment}
          />
          <TouchableWithoutFeedback
            onPress={this.showComment}
          >
            <CommentBox>
              <Comment comment={comment} />
            </CommentBox>
          </TouchableWithoutFeedback>
        </Container>
        <Comments
          visible={commentVisible}
          ref={this.comments}
          onPress={this.hideComment}
          comment={comment}
          style={{
            transform: [{ translateX: translateCommentX }],
            position: 'absolute'
          }}
        />
      </View>
    )
  }
}

RecentGrade.defaultProps = {
  name: 'Gradebook Name Not Found',
  grade: Math.ceil(Math.random() * 100),
  dateGraded: dayjs().format('MMM DD HH:mm a')
}

export default RecentGrade
