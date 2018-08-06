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
import styled, {withTheme} from 'styled-components'
import {connect} from 'react-redux'
import {getAnnouncements} from '../../actions/announcements'
import {withNavigation} from 'react-navigation'
import ActivityIndicator from '../ActivityIndicator'

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.viewBackground};
`

const AnnouncementContainer = styled.View`
  background-color: ${props => props.theme.announcementBackground};
  align-items: flex-start;
  justify-content: center;
  elevation: 3;
  shadow-color: ${props => props.theme.announcementShadow};
  shadow-opacity: 0.5;
  shadow-radius: 2px;
  shadow-offset: 0px 2px;
`

const AnnouncementBody = styled(WebView)`
  width: ${props => Dimensions.get('window').width - props.margin * 2}px;
  background-color: ${props => props.theme.announcementBackground};
`

const AnnouncementTitleContainer = styled(TouchableOpacity)`
  height: 40px;
  align-items: flex-start;
  justify-content: center;
  padding-left: 8px;
  width: 100%;
  background-color: ${props => props.theme.announcementBackground};
`

const AnnouncementTitle = styled.Text`
  font-weight: bold;
  font-size: 18px;
  color: ${props => props.theme.darkText};
`

const makeHTML = (body, theme) => (
  `<html>
    <head>
      <meta name='viewport' content='width=device-width, initial-scale=1'>
      <script>
        const getScrollHeight = () => {
          document.title = document.body.scrollHeight
        }
      </script>
      <style>
        body {
            background-color: ${theme.announcementBackground}      
        }
        a:link {
            color: #30B1FF;
        }
        a:visited {
            color: mediumpurple;        
        }
        a:hover {
        
        }
        a:active {
        
        }
      </style>
    </head>
    <body text=${theme.darkText} onload='getScrollHeight()'>
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
    const {announcement: {body, title}, theme} = this.props
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
          source={{html: makeHTML(body, theme)}}
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
    const {announcements, loading, theme} = this.props
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
          renderItem={({item}) => <Announcement theme={theme} announcement={item} />}
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

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(withTheme(AnnouncementsScreen)))