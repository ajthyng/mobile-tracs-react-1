import React, {Component} from 'react'
import {
  FlatList,
  Dimensions,
  Linking,
  View,
  TouchableOpacity,
  ScrollView,
  WebView
} from 'react-native'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {getAnnouncements} from '../../actions/announcements'
import {withNavigation} from 'react-navigation'
import ActivityIndicator from '../../_components/Helper/ActivityIndicator'

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: white;
`

const AnnouncementContainer = styled.View`
  background-color: white;
  align-items: flex-start;
  justify-content: center;
  elevation: 3;
  shadow-color: #363534;
  shadow-opacity: 0.5;
  shadow-radius: 2px;
  shadow-offset: 0px 2px;
`

const AnnouncementBody = styled(WebView)`
  width: ${props => Dimensions.get('window').width - props.margin * 2}px;
`

const AnnouncementTitleContainer = styled(TouchableOpacity)`
  height: 40px;
  align-items: flex-start;
  justify-content: center;
  padding-left: 8px;
  width: 100%;
  background-color: white;
`

const AnnouncementTitle = styled.Text`
  font-weight: bold;
  font-size: 18px;
`

const makeHTML = (body) => (
  `<html>
    <head>
      <meta name='viewport' content='width=device-width, initial-scale=1'>
      <script>
        const getScrollHeight = () => {
          document.title = document.body.scrollHeight
        }
      </script>
    </head>
    <body onload='getScrollHeight()'>
      ${body}    
    </body>
  </html>
  `
)

class Announcement extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 100,
      showBody: false
    }
    this.contentMargin = 10
  }

  updateHeight = event => {
    const {title, jsEvaluationValue} = event
    this.setState({height: parseInt(jsEvaluationValue || title)})
  }

  render() {
    const {announcement: {body, title}} = this.props
    const {height, showBody} = this.state

    return (
      <AnnouncementContainer style={{margin: this.contentMargin}}>
        <AnnouncementTitleContainer activeOpacity={1} onPress={() => {
          this.setState({showBody: !showBody})
        }}>
          <AnnouncementTitle>{title}</AnnouncementTitle>
        </AnnouncementTitleContainer>
        <AnnouncementBody
          margin={this.contentMargin}
          innerRef={c => this.webView = c}
          style={{height: showBody ? height : 0}}
          mixedContentMode='compatibility'
          injectedJavaScript='(() => document.body.scrollHeight)()'
          onNavigationStateChange={(event) => {
            if (event.url !== 'about:blank') {
              this.webView.stopLoading()
              if (Linking.canOpenURL(event.url)) {
                Linking.openURL(event.url).then(result => console.log(result)).catch(err => console.log(err))
              }
              return
            }
            this.updateHeight(event)
          }}
          source={{html: makeHTML(body)}}
        />
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
    const {announcements, loading} = this.props
    return loading ? (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator />
      </View>
    ) : (
      <Container>
        <FlatList
          bounces={false}
          data={announcements}
          style={{width: '100%'}}
          contentContainerStyle={null}
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
    announcements,
    loading: state.announcements.isLoading
  }
}

const mapDispatchToProps = dispatch => ({
  getAnnouncements: () => dispatch(getAnnouncements())
})

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(AnnouncementsScreen))