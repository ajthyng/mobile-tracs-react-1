import React, {Component} from 'react';
import {Platform, View, StyleSheet, Text} from 'react-native';
import Ripple from 'react-native-material-ripple';
import styled, { withTheme } from 'styled-components';
import { Transition } from 'react-navigation-fluid-transitions'

const HEIGHT = 100;

const CardBoundary = styled(Ripple)`
	height: ${100}px;
	background-color: ${props => props.theme.courseCardBackground};
	margin: 10px;
	border-radius: ${props => props.borderRad || 0};
	flex-direction: row;
	shadow-color: ${props => props.theme.courseCardShadow};
	shadow-offset: 1px 2px;
	shadow-opacity: 0.4;
	shadow-radius: 1px;
	elevation: 3;
	flex: 1;
`;

const GradeContainer = styled.View`
	width: ${HEIGHT}px;
	height: ${HEIGHT}px;
	border-top-left-radius: ${props => props.borderRad};
	border-bottom-left-radius: ${props => props.borderRad};
	border-bottom-right-radius: 0;
	border-top-right-radius: 0;
	background-color: transparent;
	align-items: flex-start;
	flex-direction: row;
`;

const SideBar = styled.View`
	width: ${props => props.hasGrade ? HEIGHT : HEIGHT * 0.1};
	height: ${HEIGHT};
	position: absolute;
	left: 0;
	top: 0;
	border-bottom-left-radius: ${props => props.borderRad};
	border-top-left-radius: ${props => props.borderRad};
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
	background-color: dodgerblue;
`;

const GradeValueContainer = styled.View`
	flex: 1;
	height: ${HEIGHT};
	justify-content: center;
	background-color: ${props => props.theme.transparent};
`;

const Grade = styled.Text`
	text-align: center;
	color: ${props => props.hasGrade ? props.theme.lightText : props.theme.darkText};
	font-size: 16px;
`;

const CourseInfoContainer = styled.View`
	background-color: transparent;
	padding-top: 8px;
	border-top-right-radius: ${props => props.borderRad || 0};
	border-bottom-right-radius: ${props => props.borderRad || 0};
	border-bottom-left-radius: 0;
	border-top-left-radius: 0;
	flex: 1;
`;

const CourseName = styled.Text`
	font-size: 18px;
	margin-left: 8px;
	color: ${props => props.theme.darkText};
	text-align: left;
	background-color: transparent;
`;

const CourseInstructor = styled.Text`
	font-size: 14px;
	margin-left: 8px;
	color: ${props => props.theme.darkText};
	text-align: left;
`;

const Dash = styled.View`
	background-color: ${props => props.color};
	width: 1px;
	height: 6px;
`;

const Line = styled.View`
	background-color: ${props => props.color};
	width: 1px;
	height: ${HEIGHT};
`;

const GradeRightBorder = (props) => {

	const {color, dashStyle} = props;
	const segments = Math.ceil(HEIGHT / 10);

	const solid = dashStyle !== 'dash';

	let dashes = [];
	let line = <Line color={color}/>;
	for (let i = 0; i < segments; i++) {
		dashes.push(<Dash key={`${i}`} color={color}/>)
	}

	return (
		<View style={{justifyContent: 'space-between', alignItems: 'center'}}>
			{solid ? line : dashes}
		</View>
	);
};

const gradeAsLetter = (grade) => {
	switch (true) {
		case 90 <= grade && grade <= 100:
			return 'A';
		case 80 <= grade && grade < 90:
			return 'B';
		case 70 <= grade && grade < 80:
			return 'C';
		case 60 <= grade && grade < 70:
			return 'D';
		case 50 <= grade && grade < 60:
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
		this.state = {
			extraContent: null
		};
	}

	render() {
		let {name, instructor, grades, borderRadius} = this.props;
		let points = grades.reduce((accum, {grade, points}) => {
			accum.earned += grade;
			accum.total += points;
			return accum;
		}, {earned: null, total: null});

		let hasGrade = points.earned !== null;

		return (
			<View style={{flex: 1}}>
				<CardBoundary borderRad={borderRadius} onPress={this.props.goToCourse}>
					<GradeContainer borderRad={borderRadius}>
						<SideBar hasGrade={hasGrade} borderRad={borderRadius}/>
						<GradeValueContainer>
							<Grade hasGrade={hasGrade}>{!hasGrade ? "--" : formatGrade(points)}</Grade>
						</GradeValueContainer>
					</GradeContainer>
					<GradeRightBorder dashStyle={hasGrade ? '' : 'dash'} color={this.props.theme.dashColor}/>
					<CourseInfoContainer borderRad={borderRadius}>
						<Transition shared={name}>
							<CourseName numberOfLines={1} ellipsizeMode="tail">{name}</CourseName>
						</Transition>
						<CourseInstructor numberOfLines={1} ellipsizeMode="tail">{instructor}</CourseInstructor>
					</CourseInfoContainer>
				</CardBoundary>
			</View>
		)
	}
}

CourseCard.defaultProps = {
	borderRadius: 3,
	name: "Course Name Not Found",
	instructor: "Instructor TBA",
	grades: []
};

export default withTheme(CourseCard);