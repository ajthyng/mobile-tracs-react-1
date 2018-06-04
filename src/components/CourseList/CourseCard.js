import React, {Component} from 'react';
import {Platform, View, StyleSheet, Text} from 'react-native';
import Ripple from 'react-native-material-ripple';
import styled from 'styled-components';

const HEIGHT = 100;

const CardBoundary = styled.View`
	height: ${HEIGHT}px;
	background-color: #fefefe;
	margin: 10px;
	border-radius: ${props => props.borderRadius || 0}px;
	border-color: #b0b0b080;
	border-width: ${StyleSheet.hairlineWidth};
	flex-direction: row;
	shadow-color: #142945;
	shadow-offset: 1px 2px;
	shadow-opacity: 0.4;
	shadow-radius: 1px;
	elevation: 3;
`;

const GradeContainer = styled(Ripple)`
	width: ${HEIGHT};
	height: 100%;
	border-top-left-radius: ${props => props.borderRadius}px;
	border-bottom-left-radius: ${props => props.borderRadius}px;
	border-bottom-right-radius: 0;
	border-top-right-radius: 0;
	background-color: transparent;
	align-items: flex-start;
	flex-direction: row;
`;

const GradeContainerBorder = styled.View`
	width: ${HEIGHT};
	border-bottom-left-radius: 3px;
	border-top-left-radius: 3px;
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
	width: ${props => props.hasGrade ? HEIGHT : HEIGHT * 0.1};
	height: ${HEIGHT};
	position: absolute;
	left: 0;
	border-bottom-left-radius: 3px;
	border-top-left-radius: 3px;
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

const CourseInfoContainer = styled(Ripple)`
	background-color: transparent;
	padding-top: 8px;
	border-top-right-radius: ${props => props.borderRadius || 0}px;
	border-bottom-right-radius: ${props => props.borderRadius || 0}px;
	border-bottom-left-radius: 0;
	border-top-left-radius: 0;
	flex: 1;
`;

const CardContentRow = styled(Ripple)`
	height: ${HEIGHT * 0.8}px;
`;

const BorderMask = styled.View`
	width: ${HEIGHT - 1};
	height: 100%;
	border-bottom-left-radius: 3px;
	border-top-left-radius: 3px;
	border-color: #b0b0b080;
	border-top-width: 1px;
	border-bottom-width: 1px;
	position: absolute;
	background-color: ${props => props.hasGrade ? 'dodgerblue' : 'white'};
	align-items: flex-start;
	flex-direction: row;
	left: 0;
`;

const CourseName = styled.Text`
	font-size: 18px;
	margin-left: 8px;
	color: #363534;
	text-align: left;
	background-color: transparent;
`;

const CourseInstructor = styled.Text`
	font-size: 14px;
	margin-left: 8px;
	color: #363534;
	text-align: left;
`;

const GradeToContentBoundary = styled.View`
	width: 2px;
	height: 100%;
	position: absolute;
	left: ${HEIGHT};
	background-color: #36353430;
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
			<CardBoundary borderRadius={borderRadius}>
				<GradeContainer borderRadius={borderRadius}>
					<SideBar hasGrade={hasGrade}/>
					<GradeValueContainer>
						<Grade hasGrade={hasGrade}>{!hasGrade ? "--" : formatGrade(points)}</Grade>
					</GradeValueContainer>
				</GradeContainer>
				<GradeRightBorder dashStyle={hasGrade ? '' : 'dash'} color='#36353440'/>
				<CourseInfoContainer borderRadius={borderRadius}>
					<CourseName numberOfLines={1} ellipsizeMode="tail">{name}</CourseName>
					<CourseInstructor numberOfLines={1} ellipsizeMode="tail">{instructor}</CourseInstructor>
				</CourseInfoContainer>
			</CardBoundary>
		)
	}
}

CourseCard.defaultProps = {
	borderRadius: 3
};

export default CourseCard;