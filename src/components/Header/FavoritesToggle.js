import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components'
import { toggleStatus } from '../../constants/sites'
import Icon from 'react-native-vector-icons/FontAwesome'

const {
  FAVORITES,
  ALL_SITES
} = toggleStatus

const BORDER_COLOR = '#000000A0'

const Container = styled.View`
  flex: 2;
  max-width: ${props => props.small ? '75%' : '250px'};
  height: ${props => props.small ? '35px' : '40px'};
  background-color: #501214;
  border-radius: 2px;
  flex-direction: row;
  border: 2px solid ${BORDER_COLOR};
`

const Favorite = styled((props) => <TouchableOpacity {...props} activeOpacity={1} />)`
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.active ? 'transparent' : BORDER_COLOR};
`

const AllSites = styled(Favorite)`
  background-color: ${props => props.active ? 'transparent' : BORDER_COLOR};
`

const Label = styled.Text`
  margin-left: 6px;
  color: ${props => props.active ? 'white' : '#b77c7e'};
  font-size: ${props => props.small ? '12' : '14'}px;
  padding-bottom: 2px;
`

const StyledIcon = styled(Icon)`
  font-size: ${props => props.small ? '12' : '14'}px;
  line-height: 14px;
  color: ${props => props.active ? 'white' : '#b77c7e'};
`

class FavoritesToggle extends Component {
  onPress = (status) => () => {
    this.props.onValueChange && this.props.onValueChange(status)
  }

  render () {
    const favoritesActive = this.props.status === FAVORITES
    const allSitesActive = this.props.status === ALL_SITES
    const { small } = this.props

    return (
      <Container small={small}>
        <Favorite active={favoritesActive} onPress={this.onPress(FAVORITES)}>
          <StyledIcon name='star' active={favoritesActive} small={small} />
          <Label active={favoritesActive} small={small}>FAVORITES</Label>
        </Favorite>
        <AllSites active={allSitesActive} onPress={this.onPress(ALL_SITES)}>
          <StyledIcon name='th' active={allSitesActive} small={small} />
          <Label active={allSitesActive} small={small}>ALL SITES</Label>
        </AllSites>
      </Container>
    )
  }
}

export default FavoritesToggle
