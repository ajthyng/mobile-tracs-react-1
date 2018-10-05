import React, { PureComponent } from 'react'
import styled from 'styled-components'
import Star from '../../CourseList/CourseCard/Star'

const HEIGHT = 80

const CardBoundary = styled.View`
  height: ${HEIGHT}px;
  align-self: stretch;
  background-color: #FFFFFF;
  border-radius: 2px;
  flex-direction: row;
  shadow-color: #142945;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 2px;
  elevation: 3;
  margin: 10px;
`

const ColorBar = styled.View`
  height: 100%;
  width: 10px;
  background-color: #A0A0A0;
`

const EmptyGrade = styled.View`
  align-items: center;
  flex-basis: 100px;
  justify-content: center;
  border-right-width: 1px;
  border-right-color: #F0F0F0;
`

const EmptyContent = styled.View`
  height: 100%;
  flex-grow: 1;
  padding-left: 12px;
  padding-top: 12px;
`

const TitleBar = styled.View`
  flex: 1;
`

const Title = styled.Text`
  color: #363534;
  font-size: 18px;
`

const InactiveStar = styled(Star)`
  padding: 10px;
`

const NoGrade = styled.Text`
  font-size: 10px;
  color: #80808080;
  text-align: center;
`

class ExampleCourseCard extends PureComponent {
  render () {
    return (
      <CardBoundary>
        <ColorBar />
        <EmptyGrade>
          <NoGrade>{'NO FINAL\nGRADE POSTED'}</NoGrade>
        </EmptyGrade>
        <EmptyContent>
          <TitleBar>
            <Title numberOfLines={1} >ARCHIVE OCED 4350</Title>
          </TitleBar>
        </EmptyContent>
        <InactiveStar active />
      </CardBoundary>
    )
  }
}

export default ExampleCourseCard
