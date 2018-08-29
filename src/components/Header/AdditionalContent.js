import React, {Component} from 'react'
import styled, {withTheme} from 'styled-components'
import FavoritesToggle from './FavoritesToggle'

const Container = styled.View`
  padding: 12px;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  padding-right: 8px;
  flex-direction: row;
  background-color: ${props => props.theme.header};
`

class AdditionalContent extends Component {
  render () {
    const {visible, allSitesFilter, onValueChange} = this.props

    return visible ? (
      <Container>
        <FavoritesToggle onValueChange={onValueChange} status={allSitesFilter} />
      </Container>
    ) : null
  }
}

export default withTheme(AdditionalContent)
