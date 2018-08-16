import React, {Component} from 'react'
import {StatusBar, Dimensions, SectionList} from 'react-native'
import styled, {withTheme} from 'styled-components'
import {connect} from 'react-redux'
import {getSettings, saveSettings} from '../../actions/settings'
import {getSiteInfo} from '../../actions/sites'
import {setTheme} from '../../actions/theme'
import {types} from '../../constants/notifications'
import {defaultTheme, darkTheme} from '../../constants/themes'
import SiteSetting from './SiteSetting'
import ActivityIndicator from '../ActivityIndicator'

const isEqual = require('lodash.isequal')

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: ${props => props.theme.viewBackground};
`

const SectionHeader = styled.Text`
  font-size: 18px;
  color: ${props => props.theme.darkText};
  padding: 16px 8px;
  width: 100%;
  background-color: ${props => props.theme.viewBackground};
`

const SettingsList = styled(SectionList)`
  flex: 1;
  width: ${props => props.width}px;
`

const onThemeToggle = (setTheme) => (on) => {
  const theme = on ? darkTheme : defaultTheme
  const name = on ? darkTheme.NAME : defaultTheme.NAME
  setTheme(theme, name)
}

const isSiteDisabled = (blacklist, sites) => (accum, siteId) => {
  const on = !blacklist.some(item => (item.other_keys || {}).site_id === siteId)
  accum.push({...sites[siteId], on})
  return accum
}

const sections = ({setTheme, themeName, sites, blacklist, announcementsDisabled, forumsDisabled}, onToggle) => {
  const siteList = Object.keys(sites)
    .reduce(isSiteDisabled(blacklist, sites), [])
    .map(site => ({...site, onToggle}))
    .map(site => ({...site, type: 'site'}))

  return [
    {
      title: '', data: [
        {
          name: 'Dark Mode',
          onToggle: onThemeToggle(setTheme),
          on: themeName === darkTheme.NAME,
          id: '2'
        }
      ]
    },
    {
      title: 'App Notifications',
      data: [
        {
          name: 'Announcements',
          id: '0',
          on: !announcementsDisabled,
          onToggle: onToggle,
          type: types.ANNOUNCEMENT
        },
        {
          name: 'Forums',
          id: '1',
          on: !forumsDisabled,
          onToggle: onToggle,
          type: types.FORUM
        }
      ]
    },
    {title: 'Course Notifications', data: siteList}
  ]
}

class SettingsScreen extends Component {
  constructor(props) {
    super(props)
    const {width, height} = Dimensions.get('window')
    this.state = {
      width,
      height,
      enabled: true
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
    const {window: {width, height}} = event
    this.setState({
      width,
      height
    })
  }

  renderItem = ({item}) => {
    const {enabled} = this.state
    const {onToggle, on, name, id, type} = item
    return (
      <SiteSetting
        onValueChange={onToggle}
        enabled={enabled}
        name={name}
        on={on}
        siteId={id}
        type={type}
      />
    )
  }

  updateSettings = (setting, enabled) => {
    this.setState({enabled: false})
    let blacklist = [...this.props.blacklist]
    let dispatchSetting = {
      keys: {...setting.keys},
      other_keys: {...setting.other_keys}
    }

    if (enabled) {
      blacklist = blacklist.filter(item => !isEqual(item, dispatchSetting))
    } else {
      blacklist = [...blacklist, dispatchSetting]
    }
    this.props.saveSettings({blacklist})
  }

  componentDidUpdate (prevProps) {
    if (prevProps.isSaving && !this.props.isSaving) {
      this.props.getSettings()
      this.setState({enabled: true})
    }
  }

  render() {
    const {loading} = this.props

    const settings = sections(this.props, this.updateSettings)
    const {width} = this.state

    return loading ? (<ActivityIndicator />) : (
      <Container>
        <SettingsList
          width={width}
          sections={settings}
          keyExtractor={item => item.id}
          renderItem={this.renderItem}
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

const isNotificationDisabled = (type) => (item) => {
  return (item.keys || {}).object_type === type
}

const mapDispatchToProps = (dispatch, props) => ({
  getSettings: () => dispatch(getSettings(props.token)),
  getSites: () => dispatch(getSiteInfo(props.netid)),
  saveSettings: (settings) => dispatch(saveSettings(settings)),
  setTheme: (theme, name) => dispatch(setTheme(theme, name))
})

const mapStateToProps = state => {
  const {blacklist} = state.settings.userSettings
  const announcementsDisabled = blacklist.some(isNotificationDisabled(types.ANNOUNCEMENT))
  const forumsDisabled = blacklist.some(isNotificationDisabled(types.FORUM))

  return {
    token: state.registrar.deviceToken,
    sites: state.tracsSites.userSites,
    isSaving: state.settings.isSaving,
    blacklist,
    announcementsDisabled,
    forumsDisabled,
    loading: state.settings.isFetching || state.tracsSites.isFetchingSites,
    errorMessage: state.settings.errorMessage,
    pending: state.settings.isSaving,
    success: state.settings.isSaved,
    netid: state.registrar.netid,
    themeName: state.theme.name
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(SettingsScreen))