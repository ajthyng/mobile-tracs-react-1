import React, {Component} from 'react'
import {TouchableOpacity, View} from 'react-native'
import styled from 'styled-components'
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'

const AnnouncementsContainer = styled.View`
	height: 65px;
	width: 100%;
	background-color: ${props => props.theme.transparent};
	flex-direction: row;
	align-items: center;
	justify-content: center;
`

const AnnouncementsIcon = styled(Icon)`
	color: ${props => props.theme.darkText};
	font-size: 24px;
	text-align: center;
	padding-right: 8px;
`

const AnnouncementsText = styled.Text`
	font-size: 20px;
	color: ${props => props.theme.darkText};
	text-align: center;
`

const IconContainer = styled.View``

const NewBadge = styled.View`
	position: absolute;
	background-color: ${props => props.theme.notificationBadge};
	top: 0;
	right: 8px;
	width: 8px;
	height: 8px;
	border-radius: 5px;
`

const renderAnnouncements = unseen => {
  const title = unseen ? 'New Announcements' : 'Announcements'
  return (
    <AnnouncementsContainer>
      <IconContainer>
        <AnnouncementsIcon name='bell' />
        {unseen ? <NewBadge /> : null}
      </IconContainer>
      <AnnouncementsText>{title}</AnnouncementsText>
    </AnnouncementsContainer>
  )
}

const Announcements = ({hasNewAnnouncements, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      {renderAnnouncements(hasNewAnnouncements)}
    </TouchableOpacity>
  )
}

Announcements.defaultProps = {
  hasNewAnnouncements: false,
  onPress: () => null
}

const mapStateToProps = (state, props) => {
  const {announcements} = state.notifications

  const hasNewAnnouncements = (announcements || []).some(({seen, other_keys}) => {
    const unseen = !seen
    const forThisSite = (other_keys || {}).site_id === props.id

    return unseen && forThisSite
  })
  return {
    hasNewAnnouncements
  }
}

export default connect(mapStateToProps, null)(Announcements)