import React, { PureComponent } from 'react'
import styled from 'styled-components'
import TabButton from './TabButton'

const Container = styled.View`
  flex: 1;
  justify-content: flex-end;
`

const Bar = styled.View`
  flex-direction: row;
  background-color: white;
  height: 60px;
  justify-content: space-between;
  align-self: center;
  max-width: 350px;
`

const Icon = props => <TabButton {...props} solid />

class PageTwo extends PureComponent {
  render () {
    return (
      <Container>
        <Bar>
          <Icon name='bullhorn' label='Announcements' dot />
          <Icon name='comments' label='Forums' />
          <Icon name='folder-open' label='Resources' />
          <Icon name='check-square' label='Attendance' />
        </Bar>
      </Container>
    )
  }
}

export default PageTwo
