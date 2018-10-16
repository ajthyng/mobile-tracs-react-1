import React, { PureComponent } from 'react'
import styled from 'styled-components'
import RecentGrades from '../../CourseDetailScreen/RecentGrades/RecentGrades'
import dayjs from 'dayjs'

const Container = styled.View`
  flex: 1;
  justify-content: flex-end;
`

const InnerContainer = styled.View`
  background-color: rgb(234, 234, 234);
  padding-top: 6px;
`

const GradesText = styled.Text`
  font-size: 10px;
  color: #363534;
  padding-left: 16px;
`

const fakeGrades = [
  {
    itemName: 'Assignment #1',
    grade: '65',
    points: '100',
    comment: 'Great Job!',
    postedDate: dayjs().valueOf()
  },
  {
    itemName: 'Assignment #2',
    grade: '100',
    points: '100',
    comment: 'Great Job!',
    postedDate: dayjs().valueOf()
  },
  {
    itemName: 'Assignment #3',
    grade: '85',
    points: '100',
    comment: `Great Job!`,
    postedDate: dayjs().valueOf()
  }
]

class PageOne extends PureComponent {
  render () {
    return (
      <Container>
        <InnerContainer style={{ transform: [{ scale: 0.8 }] }}>
          <GradesText>RECENT GRADES</GradesText>
          <RecentGrades grades={fakeGrades} />
        </InnerContainer>
      </Container>
    )
  }
}

export default PageOne
