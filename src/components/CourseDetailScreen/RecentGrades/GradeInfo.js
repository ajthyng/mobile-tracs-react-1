import React, {PureComponent} from 'react'
import {TouchableWithoutFeedback} from 'react-native'
import styled from 'styled-components'
import dayjs from 'dayjs'

const Container = styled.View`
  height: 100%;
  flex: 1;
  flex-direction: column;
`

const Info = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  height: 100%;
`

const Name = styled.Text`
  padding-left: 8px;
  font-size: 20px;
  color: ${props => props.theme.darkText};
`

const Posted = styled.Text`
  align-self: flex-start;
  padding-left: 8px;
  font-size: 12px;
  color: ${props => props.theme.darkText};
`

const CommentBox = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-left: 8px;
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

const Title = styled.View`
  flex: 1;
  align-items: flex-start;
  justify-content: flex-end;
`

const Comment = ({comment, onPress}) => {
  return comment
    ? (
      <React.Fragment>
        <ViewComments>View Comments</ViewComments>
        <Dot />
      </React.Fragment>
    ) : null
}

class GradeInfo extends PureComponent {
  showComment = () => {
    this.props.onShowComment && this.props.onShowComment()
  }

  render () {
    const {name, posted, comment} = this.props
    return (
      <Container>
        <Title>
          <Name numberOfLines={1} ellipsizeMode='tail'>{name}</Name>
        </Title>
        <Info>
          {posted ? <Posted>{dayjs(posted).format('MMM D, h:mma')}</Posted> : null}
          <TouchableWithoutFeedback onPress={this.showComment} >
            <CommentBox>
              <Comment comment={comment} />
            </CommentBox>
          </TouchableWithoutFeedback>
        </Info>
      </Container>
    )
  }
}

GradeInfo.defaultProps = {
  name: null,
  posted: null,
  comment: null
}

export default GradeInfo
