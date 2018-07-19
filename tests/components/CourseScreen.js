import {mapStateToProps} from '../../src/components/CourseScreen/CourseScreen'
import * as gradesResponse from './grades.json'
import dayjs from 'dayjs'

let id

beforeEach(() => {
	id = 'f1003153-75b9-4abc-bc09-7a0e83d21293'
})

it('should display an empty array if grades do not exist', () => {
	const course = {id}
	const state = {}

	const props = {course}
	const grades = mapStateToProps(state, props)

	expect(grades.mostRecentGrades.length).toBe(0)
})

it('should display an empty array if grades but the grades array is undefined', () => {
	const course = {id}
	let state = {
		grades: {...gradesResponse}
	}

	const props = {course}

	delete state.grades.grades
	const grades = mapStateToProps(state, props)
	expect(grades.mostRecentGrades.length).toBe(0)
})

it('should return empty array if grades array is empty', () => {
	const course = {id}
	let state = {
		grades: {...gradesResponse}
	}

	const props = {course}

	state.grades.grades = []
	const grades = mapStateToProps(state, props)

	expect(grades.mostRecentGrades.length).toBe(0)
	expect(Array.isArray(grades.mostRecentGrades)).toBeTruthy()
})

it('should order grades by most recent', () => {
	const course = {id}
	let state = {
		grades: {...gradesResponse}
	}

	const props = {course}

	const {mostRecentGrades: grades} = mapStateToProps(state, props)

	const firstDate = dayjs(grades[0].postedDate)
	const secondDate = dayjs(grades[1].postedDate)
	const thirdDate = dayjs(grades[2].postedDate)

	const firstDayIsFirst = firstDate.isAfter(secondDate)
	const secondDayIsSecond = secondDate.isAfter(thirdDate)

	expect(firstDayIsFirst).toBeTruthy()
	expect(secondDayIsSecond).toBeTruthy()

	expect(grades.length).toBe(3)
})

it('should return an empty array if grades are missing postedDates', () => {
	const course = {id}
	let state = {
		grades: {...gradesResponse}
	}

	const props = {course}

	state.grades.grades.forEach(course => {
		course.grades = course.grades.map(grade => {
			delete grade.postedDate
			return grade
		})
	})

	const {mostRecentGrades: grades} = mapStateToProps(state, props)
	expect(grades.length).toBe(0)
})

it('should return an empty array if course has no id', () => {
	let state = {
		grades: {...gradesResponse}
	}

	const props = {course: {}}
	const {mostRecentGrades: grades} = mapStateToProps(state, props)

	expect(grades.length).toBe(0)
})

it('should return an empty array if course and grades entry have no course id', () => {
	let state = {
		grades: {...gradesResponse}
	}
	const props = {course: {}}

	state.grades.grades = state.grades.grades.map(course => {
		delete course.id
		return course
	})

	const {mostRecentGrades: grades} = mapStateToProps(state, props)

	expect(grades.length).toBe(0)
})