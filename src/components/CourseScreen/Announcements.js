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

const NewBadge = styled.View`
	position: absolute;
	background-color: ${props => props.theme.notificationBadge};
	top: 0;
	right: 8px;
	width: 8px;
	height: 8px;
	border-radius: 5px;
`

class Announcements extends Component {
	render() {
		const {hasNewAnnouncements, onPress} = this.props
		const title = hasNewAnnouncements ? 'New Announcements' : 'Announcements'
		return (
			<TouchableOpacity onPress={onPress}>
				<AnnouncementsContainer>
						<View>
							<AnnouncementsIcon name='bell' />
							{hasNewAnnouncements ? <NewBadge /> : null}
						</View>
						<AnnouncementsText>{title}</AnnouncementsText>
				</AnnouncementsContainer>
			</TouchableOpacity>
		)
	}
}

const mapStateToProps = (state, props) => {

	return {
		hasNewAnnouncements: false
	}
}

export default connect(mapStateToProps, null)(Announcements)