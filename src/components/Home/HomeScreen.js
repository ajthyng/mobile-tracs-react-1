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
    this.state = {
      refreshing: false
    }
  }

  componentDidMount() {
    this.initHomeScreen()
  }

  initHomeScreen = () => {
    const {netid} = this.props
    this.props.getSites(netid)
    this.props.getGrades()
    this.props.getFavorites()
    this.props.getNotifications()
  }

  onRefresh = () => {
    this.setState({ refreshing: true })
    this.initHomeScreen()
  }

  componentDidUpdate () {
    const {refreshing} = this.state
    const {loading} = this.props
    if (!loading && refreshing) this.setState({refreshing: false})
  }

  render() {
    const {loadingSites, loadingFavorites} = this.props
    const {refreshing} = this.state
    return (
      <Home>
        <CourseList
          loading={loadingSites || loadingFavorites}
          navigation={this.props.navigation}
          onRefresh={this.onRefresh}
          refreshing={refreshing}
        />
      </Home>
    )
  }
}

const mapStateToProps = (state) => {
  const {isFetchingSites: loadingSites} =  state.tracsSites
  const {isFetchingFavorites: loadingFavorites} =  state.tracsSites
  const {isLoading: loadingGrades} =  state.grades
  const {isLoading: loadingNotifications} =  state.notifications

  const loading = loadingSites || loadingFavorites || loadingGrades || loadingNotifications

  return {
    authenticated: state.login.isAuthenticated,
    netid: state.login.netid,
    loadingSites,
    loadingFavorites,
    loadingGrades,
    loadingNotifications,
    loading
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