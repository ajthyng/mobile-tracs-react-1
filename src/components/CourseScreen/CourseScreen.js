import React, {Component} from 'react'
import {Dimensions, TouchableOpacity} from 'react-native'
import styled, {withTheme} from 'styled-components'
import dayjs from 'dayjs'
import {connect} from 'react-redux'

import RecentGrades from './RecentGrades'
import Title from './Title'
import CourseButton from './CourseButton'
import Announcements from './Announcements'

const CourseContainer = styled.View`
	background-color: ${props => props.theme.courseScreenBackground};
	border: 1px;
	border-color: ${props => props.theme.courseScreenBorder};
	flex: 1;
	shadow-opacity: 0.5;
	shadow-radius: 2px;
	shadow-offset: 0px 2px;
	shadow-color:  ${props => props.theme.courseScreenShadow};
`

const TitleSeparator = styled.View`
	height: 2px;
	background-color: ${props => props.theme.courseScreenTitleSeparator};
`

const RecentText = styled.Text`
	font-size: 18px;
	color: ${props => props.theme.darkText};
	font-weight: bold;
	margin-left: 8px;
	margin-top: 8px;
`

class CourseScreen extends Component {
	static navigationOptions = {
		title: 'Course'
	}

	constructor(props) {
		super(props)
	}

	goToCourseDetail = () => {
		this.props.dismiss()
		const {course, navigation: {navigate}} = this.props
		navigate('CourseDetail', {
			transition: 'cardFromRight',
			course
		})
	}

	goToAnnouncements = () => {
		this.props.dismiss()
		const {course, navigation: {navigate}} = this.props
		navigate('Announcements', {
			transition: 'cardFromRight',
			course
		})
	}

	render() {
		const {course: {name, id}, mostRecentGrades, dismiss} = this.props

		return (
			<CourseContainer>
				<Title name={name} dismiss={dismiss} />
				<TitleSeparator />
				<RecentText>Latest Grades</RecentText>
				<RecentGrades grades={mostRecentGrades} />
				<Announcements onPress={this.goToAnnouncements} id={id} />
				<CourseButton title='View Course' onPress={this.goToCourseDetail} />
			</CourseContainer>
		)
	}
}

CourseScreen.defaultProps = {
	name: "Course Name Not Found"
}

const byPostedDate = (gradeA, gradeB) => {
	const postedDateA = dayjs(gradeA.postedDate)
	const postedDateB = dayjs(gradeB.postedDate)

	return postedDateB - postedDateA
}

const onlyPostedGrades = ({grade, postedDate}) => {
	const hasGrade = !!grade
	const hasBeenPosted = !!postedDate

	return hasGrade && hasBeenPosted
}

const toGradesForDisplayedCourse = (id) => (accum, course) => {
	if (course.id === undefined || course.id === null) return accum

	if (id === undefined || id === null) return accum

	if (course.id === id) accum.push(...course.grades)
	return accum
}

export const mapStateToProps = (state, props) => {
	const {id} = props.course
	let mostRecentGrades = []

	if (!state.hasOwnProperty('grades')) return {mostRecentGrades}

	const {grades} = (state || {}).grades

	if (!Array.isArray(grades)) return {mostRecentGrades}

	mostRecentGrades = grades
		.reduce(toGradesForDisplayedCourse(id), [])
		.filter(onlyPostedGrades)
		.sort(byPostedDate)
		.slice(0, 3)

	return {
		mostRecentGrades
	}
}

export default connect(mapStateToProps, null)(withTheme(CourseScreen))