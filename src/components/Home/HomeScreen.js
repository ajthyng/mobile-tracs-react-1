import React, {Component} from 'react'
import {connect} from 'react-redux'
import {View, StyleSheet, Animated} from 'react-native'
import {logout} from '../../actions/login'
import * as Storage from '../../utils/storage'
import CourseList from '../CourseList/CourseList'
import Header from '../../_components/CircleHeader/Header'
import {setHeaderState} from '../../actions/header'
import {getSiteInfo, getFavorites} from '../../actions/sites'
import {getGrades} from '../../actions/grades'
import {getNotifications} from '../../actions/notifications'
import {getForums} from '../../actions/forums'
import styled from 'styled-components'

const Home = styled.View`
		flex: 1;
		background-color: ${props => props.theme.viewBackground};
		width: 100%;
`

class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Home'
  }

  constructor(props) {
    super(props)
    this.props.setHeaderState(Header.EXPANDED)
  }

  componentDidMount() {
    this.props.getSites(this.props.netid)
    this.props.getGrades()
    this.props.getFavorites()
    this.props.getNotifications()
  }

  render() {
    const {loadingSites, loadingFavorites} = this.props
    return (
      <Home>
        <CourseList loading={loadingSites || loadingFavorites} navigation={this.props.navigation} />
      </Home>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.login.isAuthenticated,
    netid: state.login.netid,
    loadingSites: state.tracsSites.isFetchingSites,
    loadingFavorites: state.tracsSites.isFetchingFavorites
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    logout: () => {
      Storage.credentials.reset()
      dispatch(logout())
    },
    setHeaderState: (isCollapsed) => {
      if (props.isCollapsed !== isCollapsed) {
        dispatch(setHeaderState(isCollapsed))
      }
    },
    getSites: (netid) => dispatch(getSiteInfo(netid)),
    getGrades: () => dispatch(getGrades()),
    getFavorites: () => dispatch(getFavorites()),
    getNotifications: () => dispatch(getNotifications()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)