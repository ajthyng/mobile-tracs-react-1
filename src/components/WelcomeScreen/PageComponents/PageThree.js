import React, { PureComponent } from 'react'
import styled from 'styled-components'
import FavoritesToggle from '../../Header/FavoritesToggle'

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-end;
`

const Header = styled.View`
  width: 100%;
  align-items: center;
  height: 50px;
`

class PageThree extends PureComponent {
  state = {
    status: 'favorites'
  }

  onValueChange = () => {
    this.setState({ status: this.state.status === 'favorites' ? 'all sites' : 'favorites' })
  }

  render () {
    const { status } = this.state
    return (
      <Container>
        <Header>
          <FavoritesToggle status={status} onValueChange={this.onValueChange} />
        </Header>
      </Container>
    )
  }
}

export default PageThree
