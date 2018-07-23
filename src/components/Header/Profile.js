import React, {Component} from 'react'
import {Image, Platform, View, StyleSheet, Text, Animated} from 'react-native'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {haxios as axios} from '../../utils/networking'

const CancelToken = require('axios').CancelToken

const StyledProfile = styled.View`
	background-color: transparent;
	align-items: center;
	justify-content: center;
`

const ProfileImage = styled.Image`
	border-radius: ${props => props.diameter / 2}px;
	height: ${props => props.diameter};
	width: ${props => props.diameter};
`

const ProfileText = styled.Text``

class Profile extends Component {
  state = {
    profileURL: null,
    source: CancelToken.source()
  }

  componentDidMount() {
    const {netid} = this.props

    if (!netid) return

    const profileImageURL = `${global.urls.baseUrl}${global.urls.profileImage(netid)}`
    const profileURL = `${global.urls.baseUrl}${global.urls.profile(netid)}`
    const {source: {token}} = this.state

    axios(profileImageURL, {cancelToken: token})
      .then(res => {
        this.setState({
          profileURL: (res.request || {}).responseURL || ''
        })
      })
      .catch(err => console.log(err.request))


  }

  componentWillUnmount() {
    this.state.source.cancel()
  }

  renderProfileImage = () => {
    const {diameter} = this.props
    return (
      <ProfileImage
        diameter={diameter}
        source={{
          uri: this.state.profileURL ? `${this.state.profileURL}?${new Date().valueOf()}` : `${global.urls.baseUrl}/profile2-tool/images/no_image.gif`,
          cache: 'reload'
        }}
      />
    )
  }

  render() {
    const {name, style} = this.props

    return (
      <StyledProfile style={style.container}>
        {this.renderProfileImage()}
        <ProfileText style={style.text}>
          {name}
        </ProfileText>
      </StyledProfile>
    )
  }
}

Profile.defaultProps = {
  diameter: 30,
  name: 'Andrew',
  style: {
    container: {flexDirection: 'row'},
    text: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8
    }
  }
}

const mapStateToProps = state => ({
  netid: state.registrar.netid
})

export default connect(mapStateToProps, null)(Profile)