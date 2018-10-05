import React, { PureComponent } from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'

const Container = styled.View`
  flex-direction: column;
  flex: 1;
  justify-content: flex-start;
  margin-bottom: ${props => props.hasComment ? 16 : 0}px;
`

const Info = styled.View`
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
`

const Name = styled.Text`
  font-size: 25px;
  color: #363534;
`

const Posted = styled.Text`
  align-self: flex-start;
  font-size: 12px;
  color: #363534;
`

const Title = styled.View`
  
`

class GradeInfo extends PureComponent {
  showComment = () => {
    this.props.onShowComment && this.props.onShowComment()
  }

  render () {
    const { name, posted, earned, hasComment } = this.props
    return (
      <Container hasComment={hasComment}>
        <Title>
          <Name numberOfLines={1} ellipsizeMode='tail'>{name}</Name>
        </Title>
        <Info>
          {earned ? <Posted>{posted ? dayjs(posted).format('MMM D, h:mma') : ' '}</Posted> : null}
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
