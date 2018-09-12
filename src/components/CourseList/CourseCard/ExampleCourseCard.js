import React, {PureComponent} from 'react'
import styled, {withTheme} from 'styled-components'
import Star from './Star'

const HEIGHT = 80

const CardBoundary = styled.View`
  height: ${HEIGHT}px;
  align-self: stretch;
  background-color: ${props => props.theme.courseCard.background};
  border-radius: 2px;
  flex-direction: row;
  justify-content: space-between;
  shadow-color: ${props => props.theme.courseCard.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 2px;
  elevation: 3;
  margin: 10px;
`

const ColorBar = styled.View`
  height: 100%;
  width: 10px;
  background-color: ${props => props.theme.courseCard.skeleton};

`

const EmptyGrade = styled.View`
  width: 80px;
  border-right-width: 1px;
  border-right-color: #F0F0F0;
`

const EmptyContent = styled.View`
  height: 100%;
  padding-left: 16px;
  padding-top: 16px;
`

const TitleBar = styled.View`
  height: 20px;
  width: 150px;
  background-color: #F0F0F0;
  border-radius: 3px;
`

const SubtitleBar = styled.View`
  height: 12px;
  width: 120px;
  background-color: #F0F0F0;
  margin-top: 4px;
  border-radius: 3px;
`

const InactiveStar = styled(Star)`
  padding: 10px;
`

class ExampleCourseCard extends PureComponent {
  render () {
    return (
      <CardBoundary>
        <ColorBar />
        <EmptyGrade />
        <EmptyContent>
          <TitleBar />
          <SubtitleBar />
        </EmptyContent>
        <InactiveStar />
      </CardBoundary>
    )
  }
}

export default withTheme(ExampleCourseCard)
