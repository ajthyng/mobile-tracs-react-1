import React, {Component} from 'react';
import {Platform, View, Text} from 'react-native';
import Ripple from 'react-native-material-ripple';
import styled from 'styled-components';

const HEIGHT = 100;

const CardBoundary = styled.View`
	height: ${HEIGHT}px;
	background-color: #fefefe;
	margin: 10px;
	flex-direction: row;
	shadow-color: #363534;
	shadow-offset: 0px 2px;
	shadow-opacity: 0.5;
	shadow-radius: 2px;
`;

const GradeContainer = styled.View`
	width: ${HEIGHT};
	height: 100%;
	background-color: transparent;
	align-items: flex-start;
	flex-direction: row;
`;

const GradeContainerBorder = styled.View`
	width: ${HEIGHT};
	height: 100%;
	position: absolute;
	background-color: transparent;
	align-items: flex-start;
	flex-direction: row;
	border-color: #36353480;
	border-width: 1px;
	border-style: ${props => props.hasGrade ? 'solid' : 'dashed'};
`;

const SideBar = styled.View`
	width: ${HEIGHT * 0.1};
	height: 100%;
	position: absolute;
	left: 0;
	background-color: dodgerblue;
`;

const GradeValueContainer = styled.View`
	flex: 1;
	height: 100%;
	justify-content: center;
	background-color: transparent;
`;

const Grade = styled.Text`
	text-align: center;
	color: ${props => props.hasGrade ? 'white' : '#363534'};
	font-size: 16px;
`;

const CourseInfoContainer = styled.View`
	flex: 1;
	padding-left: 5px;
	padding-top: 5px;
	height: 100%;
	background-color: transparent;
`;

const CardContentRow = styled(Ripple)`
	height: ${HEIGHT * 0.8}px;
`;

const BorderMask = styled.View`
	width: ${HEIGHT - 1};
	height: 100%;
	position: absolute;
	background-color: ${props => props.hasGrade ? 'dodgerblue' : 'white'};
	align-items: flex-start;
	flex-direction: row;
	left: 0;
`;

const CourseName = styled.Text`
	font-size: 18px;
	color: #363534;
	text-align: left;
	background-color: transparent;
`;

const CourseInstructor = styled.Text`
	font-size: 16px;
	color: #363534;
	text-align: left;
`;

const gradeAsLetter = (grade) => {
	switch (true) {
		case 90 <= grade && grade <= 100:
			return 'A';
		case 80 <= grade && grade  < 90:
			return 'B';
		case 70 <= grade && grade  < 80:
			return 'C';
		case 60 <= grade && grade  < 70:
			return 'D';
		case 50 <= grade && grade  < 60:
			return 'F';
		default:
			return 'F'
	}
};

const formatGrade = ({earned, total}) => {
	const percentage = +((earned / total) * 100).toFixed(2);
	return `${gradeAsLetter(percentage)}\n(${percentage}%)`
};

class CourseCard extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let {name, instructor, grades} = this.props;
		let points = grades.reduce((accum, {grade, points}) => {
			accum.earned += grade;
			accum.total += points;
			return accum;
		}, {earned: null, total: null});

		let hasGrade = points.earned !== null;

		return (
			<CardBoundary>
				<GradeContainerBorder hasGrade={hasGrade}/>
				<BorderMask hasGrade={hasGrade}/>
				<GradeContainer>
					<SideBar/>
					<GradeValueContainer>
						<Grade hasGrade={hasGrade}>{!hasGrade ? "--" : formatGrade(points)}</Grade>
					</GradeValueContainer>
				</GradeContainer>
				<CourseInfoContainer>
					<CourseName
						numberOfLines={1}
						ellipsizeMode="tail"
					>
						{name}
					</CourseName>
					<CourseInstructor
						numberOfLines={1}
						ellipsizeMode="tail"
					>
						{instructor}
					</CourseInstructor>
				</CourseInfoContainer>
			</CardBoundary>
		)
	}
}

export default CourseCard;