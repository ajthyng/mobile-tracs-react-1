/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, {Component} from 'react';
import {Platform, View, StyleSheet, Text, Animated} from 'react-native';
import styled, { withTheme } from 'styled-components';
import { Transition } from 'react-navigation-fluid-transitions'

const HEIGHT = 100;

const CardBoundary = styled.View`
	height: ${HEIGHT}px;
	background-color: ${props => props.theme.courseCardBackground};
	margin: 10px;
	border-radius: ${props => props.borderRad || 0};
	flex-direction: row;
	shadow-color: #A0A0A0;
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
	background-color: lightgray;
`;

const GradeValueContainer = styled.View`
	flex: 1;
	height: ${HEIGHT};
	justify-content: center;
	align-items: center;
	background-color: ${props => props.theme.transparent};
`;

const IncomingGrade = styled(Animated.View)`
	width: ${HEIGHT * 0.7}px;
	height: ${HEIGHT * 0.7}px;
	position: absolute;
	top: ${(HEIGHT - HEIGHT * 0.7) / 2}px;
	left: ${(HEIGHT - HEIGHT * 0.6) / 2}px;
	border-radius: 5px;
	background-color: #E0E0E0;
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

const IncomingCourseName = styled(Animated.View)`
	width: 80%;
	height: 20px;
	border-radius: 10px;
	background-color: #E0E0E0;
	margin-left: 8px;
`;

const IncomingCourseInstructor = styled(Animated.View)`
	height: 20px;
	width: 60%;
	border-radius: 10px;
	background-color: #E0E0E0;
	margin-left: 8px;
	margin-top: 8px;
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

class CourseSkeletonCard extends Component {
	constructor(props) {
		super(props);
		this.animation = new Animated.Value(0)
	}

	componentDidMount () {
		Animated.loop(Animated.timing(this.animation, {
			toValue: 1,
			duration: 2000,
			useNativeDriver: true
		})).start()
	}

	render() {
		const {borderRadius, name, instructor} = this.props
		const hasGrade = false
		const scale = this.animation.interpolate({
			inputRange: [0, 0.5, 1],
			outputRange: [1, 1.05, 1]
		})

		const scaleXY = [{scale}]
		const scaleX = [{scaleX: scale}]

		return (
			<View style={{flex: 1}}>
				<CardBoundary borderRad={borderRadius}>
					<GradeContainer borderRad={borderRadius}>
						<SideBar hasGrade={hasGrade} borderRad={borderRadius}/>
						<GradeValueContainer>
							<IncomingGrade style={{transform: scaleXY}}/>
						</GradeValueContainer>
					</GradeContainer>
					<GradeRightBorder dashStyle={hasGrade ? '' : 'dash'} color={this.props.theme.dashColor}/>
					<CourseInfoContainer borderRad={borderRadius}>
						<IncomingCourseName style={{transform: scaleX}} />
						<IncomingCourseInstructor style={{transform: scaleX}} />
					</CourseInfoContainer>
				</CardBoundary>
			</View>
		)
	}
}

CourseSkeletonCard.defaultProps = {
	borderRadius: 3,
	name: "Course Name Not Found",
	instructor: "Instructor TBA",
	grades: []
};

export default withTheme(CourseSkeletonCard);