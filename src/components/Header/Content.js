import React, {Component} from 'react'
import {Dimensions} from 'react-native'
import styled from 'styled-components'
import ProfileMenu from '../ProfileMenu/ProfileMenu'
import {HeaderBackButton} from 'react-navigation'
import FavoritesToggle from './FavoritesToggle'

const Container = styled.View`
  height: 75px;
  align-self: stretch;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.theme.header};
  padding-left: ${props => props.canGoBack ? 0 : 16}px;
  padding-right: 16px;
`

const BackButton = (props) => (
  <HeaderBackButton {...props} />
)

class Content extends Component {
  state = {
    screenWidth: Dimensions.get('screen').width
  }

  goToCalendar = () => {
    this.props.navigation.navigate('Calendar', {transition: 'cardFromBottom'})
  }

  updateScreenSize = ({screen: {width}}) => {
    console.log(width)
    this.setState({screenWidth: width})
  }

  componentDidMount () {
    Dimensions.addEventListener('change', this.updateScreenSize)
  }

  componentWillUnmount () {
    Dimensions.removeEventListener('change', this.updateScreenSize)
  }
  render () {
    const {navigation, onValueChange, allSitesFilter} = this.props
    const canGoBack = navigation.state.index > 0

    const previousRoute = (navigation.state.routes[navigation.state.index - 1] || {}).routeName

    let title = (previousRoute || '').replace(/([a-z])([A-Z])/g, '$1 $2')

    const routes = navigation.state.routes
    const currentParams = (routes[navigation.state.index] || {}).params || {}
    if (currentParams.hasOwnProperty('siteName')) {
      title = currentParams.siteName
    }
    const {screenWidth} = this.state
    const smallScreen = screenWidth <= 400

    const leftButton = canGoBack
      ? <BackButton
        tintColor='white'
        title={title}
        onPress={() => {
          this.props.navigation.navigate(previousRoute)
        }}
      />
      : <FavoritesToggle onValueChange={onValueChange} status={allSitesFilter} small={smallScreen} />

    return (
      <Container canGoBack={canGoBack}>
        {leftButton}
        <ProfileMenu navigation={navigation} small={smallScreen} />
      </Container>
    )
  }
}

export default Content
