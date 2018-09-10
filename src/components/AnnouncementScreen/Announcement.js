import React, {PureComponent} from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {batchUpdateNotification} from '../../actions/notifications'
import {Dimensions, Linking, TouchableOpacity, WebView} from 'react-native'
import dayjs from 'dayjs'

const Container = styled.View`
  background-color: ${props => props.theme.announcementBackground};
  align-items: flex-start;
  justify-content: center;
  align-self: stretch;
  elevation: 3;
  margin: 5px;
`

const Body = styled(WebView)`
  width: ${Dimensions.get('window').width - 10}px;
  background-color: ${props => props.theme.announcementBackground};
`

const TitleContainer = styled(TouchableOpacity)`
  align-items: flex-start;
  justify-content: center;
  padding: 16px 24px 16px 10px;
  align-self: stretch;
  background-color: ${props => props.theme.announcementBackground};
`

const Title = styled.Text`
  font-weight: ${props => props.unread ? 'bold' : '400'};
  text-decoration: ${props => props.unread ? 'underline' : 'none'};
  font-size: 20px;
  color: ${props => props.theme.darkText};
`

const Posted = styled.Text`
  font-weight: 400;
  font-size: 12px;
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

class Announcement extends PureComponent {
  state = {
    height: 100,
    width: Dimensions.get('window').width - 10,
    showBody: false,
    html: makeHTML(this.props.announcement.body, this.props.theme)
  }
  webView = React.createRef()

  updateHeight = event => {
    const {title, jsEvaluationValue} = event
    this.setState({height: parseInt(jsEvaluationValue || title)})
  }

  updateWidth = ({window: {width}}) => {
    this.setState({width})
  }

  onPress = () => {
    const {notification} = this.props

    this.setState(prev => ({showBody: !prev.showBody}), () => {
      if (notification && !notification.read && this.state.showBody) {
        this.props.markAsRead(notification.id, {read: true})
      }
    })
  }

  componentDidMount () {
    Dimensions.addEventListener('change', this.updateWidth)
  }

  componentWillUnmount () {
    Dimensions.removeEventListener('change', this.updateWidth)
  }

  render () {
    const {announcement: {body, title, createdOn}, theme, unread} = this.props
    const {height, showBody, width, html} = this.state
    const posted = dayjs(createdOn).format('MMMM D hh:mma')

    return (
      <Container>
        <TitleContainer activeOpacity={1} onPress={this.onPress}>
          <Title numberOfLines={1} ellipsizeMode='tail' unread={unread}>{title}</Title>
          <Posted>{posted}</Posted>
        </TitleContainer>
        <Body
          innerRef={this.webView}
          style={{height: showBody ? height : 0, width}}
          mixedContentMode='compatibility'
          injectedJavaScript='(() => document.body.scrollHeight)()'
          onNavigationStateChange={(event) => {
            if (event.url !== 'about:blank') {
              this.webView.current.stopLoading()
              if (Linking.canOpenURL(event.url)) {
                Linking.openURL(event.url).then(result => console.log(result)).catch(err => console.log(err))
              }
              return
            }
            this.updateHeight(event)
          }}
          source={{html}}
        />
      </Container>
    )
  }
}

Announcement.defaultProps = {
  unread: false
}

const mapDispatchToProps = dispatch => ({
  markAsRead: (id) => dispatch(batchUpdateNotification([id], {read: true}))
})

export default connect(null, mapDispatchToProps)(Announcement)
