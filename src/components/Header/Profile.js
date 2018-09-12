import React, {Component} from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {haxios as axios} from '../../utils/networking'

const CancelToken = require('axios').CancelToken

const StyledProfile = styled.View`
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
    profileURL: `${global.urls.baseUrl}/profile2-tool/images/no_image.gif`,
    source: CancelToken.source(),
    name: null
  }

  componentDidMount () {
    const {netid} = this.props

    if (!netid) return

    const profileImageURL = `${global.urls.baseUrl}${global.urls.profileImage(netid)}`
    const profileURL = `${global.urls.baseUrl}${global.urls.profile(netid)}`

    const {source: {token}} = this.state

    axios(profileImageURL, {cancelToken: token})
      .then(res => {
        this.setState({
          profileURL: `${res.request.responseURL}?${new Date().valueOf()}`
        })
      })
      .catch(err => console.log(err.request))

    axios(profileURL, {cancelToken: token})
      .then(res => {
        const {data: {displayName}} = res
        this.setState({name: displayName})
      })
      .catch(err => console.log(err))
  }

  componentWillUnmount () {
    this.state.source.cancel()
  }

  renderProfileImage = () => {
    const {diameter} = this.props
    return (
      <ProfileImage
        diameter={diameter}
        source={{
          uri: this.state.profileURL,
          cache: 'reload'
        }}
      />
    )
  }

  render () {
    const {style, shouldDisplayName} = this.props
    const {name: storedName} = this.state

    let displayName = null

    if (typeof storedName === 'string') {
      displayName = storedName.split(' ')[0]
    }

    return (
      <StyledProfile style={style.container}>
        {this.renderProfileImage()}
        <ProfileText style={style.text} numberOfLines={1} ellipsizeMode='tail'>
          {shouldDisplayName ? displayName : null}
        </ProfileText>
      </StyledProfile>
    )
  }
}

Profile.defaultProps = {
  diameter: 30,
  name: '',
  style: {
    container: {flexDirection: 'row', marginLeft: 8},
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
