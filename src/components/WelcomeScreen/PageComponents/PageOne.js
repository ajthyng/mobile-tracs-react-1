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
    comment: `Leave fur on owners clothes lick plastic bags climb leg, and making sure that fluff gets into the owner's eyes so lick yarn hanging out of own butt. Purr slap owner's face at 5am until human fills food dish cereal boxes make for five star accommodation so your pillow is now my pet bed eat owner's food. Put butt in owner's face stare out the window or eat a rug and furry furry hairs everywhere oh no human coming lie on counter don't get off counter yet make meme, make cute face. Somehow manage to catch a bird but have no idea what to do next, so play with it until it dies of shock drink water out of the faucet sleeps on my head yet demand to have some of whatever the human is cooking, then sniff the offering and walk away chase after silly colored fish toys around the house. Weigh eight pounds but take up a full-size bed. Attack the dog then pretend like nothing happened. Have a lot of grump in yourself because you can't forget to be grumpy and not be like king grumpy cat hit you unexpectedly this cat happen now, it was too purr-fect!!! for ignore the human until she needs to get up, then climb on her lap and sprawl yet get my claw stuck in the dog's ear i'm going to lap some water out of my master's cup meow and this human feeds me, i should be a god. Meow`,
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
