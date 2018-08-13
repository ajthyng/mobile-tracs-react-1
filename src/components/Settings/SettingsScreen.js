import React, {Component} from 'react'
import {StatusBar, Dimensions, SectionList} from 'react-native'
import styled, {withTheme} from 'styled-components'
import {connect} from 'react-redux'
import {getSettings} from '../../actions/settings'
import {getSiteInfo} from '../../actions/sites'
import {setTheme} from '../../actions/theme'
import {defaultTheme, darkTheme} from '../../constants/themes'
import SiteSetting from './SiteSetting'
import ActivityIndicator from '../ActivityIndicator'

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

const sections = (setTheme, themeName, siteList) => ([
  {
    title: '', data: [
      {
        name: 'Dark Mode',
        onToggle: onThemeToggle(setTheme),
        on: themeName === darkTheme.NAME,
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
])

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
    return (
      <SiteSetting
        onValueChange={item.onToggle}
        enabled={enabled}
        name={item.name}
        on={item.on}
      />
    )
  }

  render() {
    const {loading, sites, setTheme, themeName} = this.props
    const siteList = Object.keys(sites).reduce((accum, siteId) => {
      accum.push(sites[siteId])
      return accum
    }, [])

    const settings = sections(setTheme, themeName, siteList)
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

const mapDispatchToProps = (dispatch, props) => ({
  getSettings: () => dispatch(getSettings(props.token)),
  getSites: () => dispatch(getSiteInfo(props.netid)),
  setTheme: (theme, name) => dispatch(setTheme(theme, name))
})

const mapStateToProps = state => ({
  token: state.registrar.deviceToken,
  sites: state.tracsSites.userSites,
  blacklist: state.settings.userSettings.blacklist,
  global_disable: state.settings.userSettings.global_disable,
  loading: state.settings.isFetching || state.tracsSites.isFetchingSites,
  errorMessage: state.settings.errorMessage,
  pending: state.settings.isSaving,
  success: state.settings.isSaved,
  netid: state.registrar.netid,
  themeName: state.theme.name
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(SettingsScreen))