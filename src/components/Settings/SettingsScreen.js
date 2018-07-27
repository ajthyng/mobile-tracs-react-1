import React, {Component} from 'react'
import {StatusBar, Dimensions, SectionList} from 'react-native'
import styled, {withTheme} from 'styled-components'
import {setHeaderState} from '../../actions/header'
import {connect} from 'react-redux'
import {getSettings} from '../../actions/settings'
import {getSiteInfo} from '../../actions/sites'
import SiteSetting from './SiteSetting'
import ActivityIndicator from '../ActivityIndicator'

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: ${props => props.theme.viewBackground};
`

const Loading = styled.View`
  align-items: center;
  justify-content: center;
  height: 100%;
`

const globalSettings = [
  {name: 'Dark Theme', initial: 'off'},
  {name: 'Holiday Theme', initial: 'off'}
]

const notificationSettings = [
  {name: 'All Announcements', initial: 'on'},
  {name: 'All Forum Posts', initial: 'on'}
]

const Activity = (
  <Loading>
    <ActivityIndicator />
  </Loading>
)

const SectionHeader = styled.Text`
  font-size: 18px;
  color: ${props => props.theme.darkText};
  padding: 16px 8px;
  width: 100%;
  background-color: ${props => props.theme.viewBackground};
`

class SettingsScreen extends Component {
  constructor(props) {
    super(props)
    const {width, height} = Dimensions.get('window')
    this.state = {
      width,
      height
    }
  }

  componentDidMount() {
    this.props.getSettings()
    this.props.getSites()
    Dimensions.addEventListener('change', this.updateWidth)
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.updateWidth)
  }

  updateWidth = (event) => {
    console.log(event)
    const {width, height} = event
    this.setState({
      width,
      height
    })
  }

  render() {
    const {loading, sites} = this.props
    const siteList = Object.keys(sites).reduce((accum, siteId) => {
      accum.push(sites[siteId])
      return accum
    }, [])

    const sections = [
      {
        title: '', data: [
          {
            name: 'Dark Mode',
            id: '2'
          },
          {
            name: 'Holiday Theme',
            id: '3'
          }
        ]
      },
      {title: 'App Notifications', data: [{name: 'Announcements', id: '0'}, {name: 'Forums', id: '1'}]},
      {title: 'Course Notifications', data: siteList}
    ]
    const {width} = this.state
    console.log(siteList)
    return (
      <Container>
        <SectionList
          contentContainerStyle={{width}}
          ListEmptyComponent={loading ? Activity : null}
          sections={sections}
          keyExtractor={item => item.id}
          renderItem={({item}) => <SiteSetting enabled={false} name={item.name} />}
          renderSectionHeader={({section}) => {
            if (section.title.length > 0) {
              return <SectionHeader>{section.title}</SectionHeader>
            }
            return null
          }}
        />
      </Container>
    )
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  getSettings: () => dispatch(getSettings(props.token)),
  getSites: () => dispatch(getSiteInfo(props.netid))
})

const mapStateToProps = state => ({
  token: state.registrar.deviceToken,
  sites: state.tracsSites.userSites,
  blacklist: state.settings.userSettings.blacklist,
  global_disable: state.settings.userSettings.global_disable,
  loading: state.settings.isFetching,
  errorMessage: state.settings.errorMessage,
  pending: state.settings.isSaving,
  success: state.settings.isSaved,
  netid: state.registrar.netid
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(SettingsScreen))