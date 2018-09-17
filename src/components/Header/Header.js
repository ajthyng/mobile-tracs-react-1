import React, {Component} from 'react'
import {StatusBar, Platform} from 'react-native'
import styled, {withTheme} from 'styled-components'
import {connect} from 'react-redux'
import {setFilterStatus} from '../../actions/sites'

import StatusBarSpace from './StatusBarSpace'
import Content from './Content'

const HeaderContainer = styled.View`
  background-color: transparent;
  align-items: center;
  justify-content: center;
  align-self: stretch;
`

class Header extends Component {
  constructor (props) {
    super(props)
    StatusBar.setBarStyle('light-content')

    if (global.android) {
      StatusBar.setBackgroundColor(this.props.theme.header)
    }

    this.statusBarHeight = Platform.select({
      ios: 20,
      android: StatusBar.currentHeight
    })

    this.state = {
      filterStatus: this.props.filterStatus
    }
  }

  getActiveRouteName = (navigationState) => {
    if (!navigationState) {
      return null
    }
    const route = navigationState.routes[navigationState.index]

    if (route.routes) {
      return this.getActiveRouteName(route)
    }
    return route.routeName
  }

  onValueChange = (status) => {
    const {filterStatus} = this.state
    if (filterStatus !== status) {
      this.setState({filterStatus: status}, () => {
        this.props.setFilterStatus(this.state.filterStatus)
      })
    }
  }

  render () {
    const currentRoute = this.getActiveRouteName(this.props.navigation.state)
    const {filterStatus} = this.state

    return (
      <HeaderContainer>
        <StatusBarSpace statusBarHeight={this.statusBarHeight} />
        <Content
          {...this.props}
          allSitesFilter={filterStatus}
          onValueChange={this.onValueChange}
        />
      </HeaderContainer>
    )
  }
}

const mapStateToProps = state => ({
  filterStatus: state.tracsSites.filterStatus
})

const mapDispatchToProps = dispatch => ({
  setFilterStatus: status => dispatch(setFilterStatus(status))
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Header))
