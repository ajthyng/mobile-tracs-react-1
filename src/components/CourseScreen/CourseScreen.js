import React, {Component} from 'react';
import {Dimensions} from 'react-native';
import styled from 'styled-components';
import Header from '../Header/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ripple from 'react-native-material-ripple';
import RecentGrade from './RecentGrade';

const ScreenContainer = styled.View`
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: center;
	background-color: white;
	margin-top: ${Header.HEIGHT};
`;

const CourseContainer = styled.View`
	margin: 32px;
	background-color: white;
	border: 1px;
	border-color: #b0b0b080;
	flex: 1;
	shadow-opacity: 0.5;
	shadow-radius: 2px;
	shadow-offset: 0px 2px;
	shadow-color: #b0b0b0
`;

const TitleContainer = styled.View`
	height: 65px;
	background-color: transparent;
	flex-direction: row;
	align-items: center;
	justify-content: center;
`;

const CourseName = styled.Text`
	flex: 1;
	color: #363534;
	margin-left: 8px;
	font-size: 18px;
`;

const CloseIcon = styled(Icon)`
	width: 65px;
	text-align: right;
	font-size: 36px;
	color: #363534;
	padding-right: 8px;
`;

const TitleSeparator = styled.View`
	height: 2px;
	background-color: gray;
`;

const RecentGradesContainer = styled.View`
	flex: 1;
	background-color: transparent;
`;

const AnnouncementContainer = styled.View`
	height: 65px;
	background-color: transparent;
	align-items: center;
`;

const AnnouncementsButton = styled(Ripple)`
	height: 100%;
	background-color: transparent;
	padding-left: 32px;
	padding-right: 32px;
	align-items: center;
	width: 300px;
	justify-content: space-evenly;
	flex-direction: row;
`;

const AnnouncementsIcon = styled(Icon)`
	color: #363534;
	font-size: 24px;
	text-align: right;
	padding-right: 8px;
`;

const AnnouncementsText = styled.Text`
	font-size: 20px;
	color: #363534;
	text-align: right;
`;

const ViewCourseContainer = styled.View`
	height: 65px;
	background-color: transparent;
	align-items: center;
	justify-content: center;
`;

const ViewCourseButton = styled(Ripple)`
	height: 50px;
	width: 200px;
	background-color: dodgerblue;
	align-items: center;
	justify-content: center;
`;

const ViewCourseText = styled.Text`
	font-size: 20px;
	font-weight: bold;
	color: white;
`;

const RecentText = styled.Text`
	font-size: 18px;
	color: #363534;
	font-weight: bold;
	margin-left: 8px;
	margin-top: 8px;
`;

const NewBadge = styled.View`
	position: absolute;
	background-color: red;
	top: 0;
	right: 8px;
	width: 8px;
	height: 8px;
	border-radius: 5px;
`;

const AnnouncementsIconContainer = styled.View`
	flex: 1;
`;

class CourseScreen extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<ScreenContainer>
				<CourseContainer>
					<TitleContainer>
						<CourseName>{this.props.name}</CourseName>
						<CloseIcon name="close" size={36}/>
					</TitleContainer>
					<TitleSeparator/>
					<RecentText>Recently Posted Grades</RecentText>
					<RecentGradesContainer>
						<RecentGrade/>
						<RecentGrade/>
						<RecentGrade/>
					</RecentGradesContainer>
					<AnnouncementContainer>
						<AnnouncementsButton>
							<AnnouncementsIconContainer>
								<AnnouncementsIcon name="bell"/>
								<NewBadge/>
							</AnnouncementsIconContainer>
							<AnnouncementsText>New Announcements</AnnouncementsText>
						</AnnouncementsButton>
					</AnnouncementContainer>
					<ViewCourseContainer>
						<ViewCourseButton>
							<ViewCourseText>View Course</ViewCourseText>
						</ViewCourseButton>
					</ViewCourseContainer>
				</CourseContainer>
			</ScreenContainer>
		);
	}
}

CourseScreen.defaultProps = {
	name: "Course Name Not Found"
};

export default CourseScreen;