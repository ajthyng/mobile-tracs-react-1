import React, {Component} from 'react'
import {FlatList, Dimensions, ScrollView, WebView} from 'react-native'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {getAnnouncements} from '../actions/announcements'
import {withNavigation} from 'react-navigation'

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: tomato;
`

const AnnouncementContainer = styled.View`
  height: 150px;
  width: 100%;
  background-color: papayawhip;
  align-items: flex-start;
  justify-content: center;
`

const AnnouncementBody = styled(WebView)`
  width: ${Dimensions.get('window').width}px;
`

const makeHTML = (body) => (
  `<html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
      ${body}    
    </body>
  </html>
  `
)

class Announcement extends Component {
  render() {
    const {announcement: {body}} = this.props
    return (
      <AnnouncementContainer>
          <AnnouncementBody source={{html: makeHTML(body)}} />
      </AnnouncementContainer>
    )
  }
}

class AnnouncementsScreen extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.getAnnouncements()
  }

  render() {
    const {announcements} = this.props
    return (
      <Container>
        <FlatList
          data={announcements}
          style={{width: '100%'}}
          keyExtractor={item => item.announcementId}
          renderItem={({item}) => <Announcement announcement={item} />}
        />
      </Container>
    )
  }
}

AnnouncementsScreen.defaultProps = {
  course: {id: null}
}

const mapStateToProps = (state, props) => {
  const {id} = props.navigation.getParam('course', {})

  let announcements = []

  if (id === null || id === undefined) return {announcements}

  announcements = state.announcements.all.filter(item => item.siteId === id)

  return {
    announcements
  }
}

const mapDispatchToProps = dispatch => ({
  getAnnouncements: () => dispatch(getAnnouncements())
})

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(AnnouncementsScreen))