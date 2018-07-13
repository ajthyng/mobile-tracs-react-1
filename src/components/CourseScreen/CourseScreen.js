import React, {Component} from 'react'
import {Dimensions, TouchableOpacity} from 'react-native'
import styled, {withTheme} from 'styled-components'
import Header from '../CircleHeader/Header'
import Icon from 'react-native-vector-icons/FontAwesome'
import Ripple from 'react-native-material-ripple'
import RecentGrade from './RecentGrade'
import {setHeaderState} from '../../actions/header'
import {connect} from 'react-redux'

const ScreenContainer = styled.View`
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: center;
	background-color: ${props => props.theme.viewBackground};
	margin-top: ${Header.HEIGHT};
`

const CourseContainer = styled.View`
	padding: 16px;
	background-color: white;
	border: 1px;
	border-color: ${props => props.theme.courseScreenBorder};
	flex: 1;
	shadow-opacity: 0.5;
	shadow-radius: 2px;
	shadow-offset: 0px 2px;
	shadow-color:  ${props => props.theme.courseScreenShadow};
`

const TitleContainer = styled.View`
	height: 65px;
	background-color: ${props => props.theme.transparent};
	flex-direction: row;
	align-items: center;
	justify-content: center;
`

const CourseName = styled.Text`
	flex: 1;
	color: ${props => props.theme.darkText};
	margin-left: 8px;
	font-size: 18px;
`

const CloseIcon = styled(Icon)`
	width: 65px;
	text-align: right;
	font-size: 36px;
	color: ${props => props.theme.darkText};
	padding-right: 8px;
`

const TitleSeparator = styled.View`
	height: 2px;
	background-color: ${props => props.theme.courseScreenTitleSeparator};
`

const RecentGradesContainer = styled.View`
	flex: 1;
	background-color: ${props => props.theme.transparent};
`

const AnnouncementContainer = styled.View`
	height: 65px;
	background-color: ${props => props.theme.transparent};
	align-items: center;
`

const AnnouncementsButton = styled(Ripple)`
	height: 100%;
	background-color: ${props => props.theme.transparent};
	padding-left: 32px;
	padding-right: 32px;
	align-items: center;
	width: 300px;
	justify-content: space-evenly;
	flex-direction: row;
`

const AnnouncementsIcon = styled(Icon)`
	color: ${props => props.theme.darkText};
	font-size: 24px;
	text-align: right;
	padding-right: 8px;
`

const AnnouncementsText = styled.Text`
	font-size: 20px;
	color: ${props => props.theme.darkText};
	text-align: right;
`

const ViewCourseContainer = styled.View`
	height: 65px;
	background-color: ${props => props.theme.transparent};
	align-items: center;
	justify-content: center;
`

const ViewCourseButton = styled(Ripple)`
	height: 50px;
	width: 200px;
	background-color: ${props => props.theme.viewCourseButton};
	align-items: center;
	justify-content: center;
`

const ViewCourseText = styled.Text`
	font-size: 20px;
	font-weight: bold;
	color: white;
`

const RecentText = styled.Text`
	font-size: 18px;
	color: ${props => props.theme.darkText};
	font-weight: bold;
	margin-left: 8px;
	margin-top: 8px;
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

const AnnouncementsIconContainer = styled.View`
	flex: 1;
`

class CourseScreen extends Component {
	static navigationOptions = {
		title: 'Course'
	}

	constructor(props) {
		super(props)
		props.setHeaderState(true)
	}

	goToCourseDetail = () => {
		this.props.dismiss()
		this.props.navigation.navigate('CourseDetail')
	}

	render() {
		const {name} = this.props
		return (
			<CourseContainer>
				<TitleContainer>
					<CourseName>{name}</CourseName>
					<TouchableOpacity onPress={this.props.dismiss}>
						<CloseIcon name='close' size={36} />
					</TouchableOpacity>
				</TitleContainer>
				<TitleSeparator />
				<RecentText>Recently Posted Grades</RecentText>
				<RecentGradesContainer>
					<RecentGrade />
					<RecentGrade />
					<RecentGrade />
				</RecentGradesContainer>
				<AnnouncementContainer>
					<AnnouncementsButton>
						<AnnouncementsIconContainer>
							<AnnouncementsIcon name='bell' />
							<NewBadge />
						</AnnouncementsIconContainer>
						<AnnouncementsText>New Announcements</AnnouncementsText>
					</AnnouncementsButton>
				</AnnouncementContainer>
				<ViewCourseContainer>
					<ViewCourseButton onPress={this.goToCourseDetail}>
						<ViewCourseText>View Course</ViewCourseText>
					</ViewCourseButton>
				</ViewCourseContainer>
			</CourseContainer>
		)
	}
}

CourseScreen.defaultProps = {
	name: "Course Name Not Found"
}

const mapStateToProps = state => ({
	isCollapsed: state.header.isCollapsed
})

const mapDispatchToProps = (dispatch, props) => ({
	setHeaderState: isCollapsed => {
		if (props.isCollapsed !== isCollapsed) {
			dispatch(setHeaderState(isCollapsed))
		}
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(CourseScreen))