/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {initialState, gradesReducer} from '../../src/reducers/grades'
import {gradesActions} from '../../src/constants/actions'
import {makeGrade} from '../responses/grades/gradeFactory'
import CourseCard from '../../src/components/CourseList/CourseCard/CourseCard'
import readGrades from '../utils/importExcelGrades'

const _ = require('lodash/core')

const {GRADES_SUCCESS} = gradesActions
const gradeSuccess = (grades) => ({
	type: GRADES_SUCCESS,
	grades
})
const getRandom = (min, max) => {
	return Math.random() * (max - min) * min
}
it('should handle missing grades key', () => {
	const state = initialState

	expect(gradesReducer(state, {type: GRADES_SUCCESS})).toMatchObject(state)
})

it('should add ungraded grade correctly', () => {
	const grades = [makeGrade()]

	const calculatedGrade = CourseCard.calculateGrade(grades)

	expect(calculatedGrade.total).toBeNull()
	expect(calculatedGrade.earned).toBeNull()
})

it('should add multiple graded and ungraded items together', () => {
	const grades = [
		makeGrade(50, 50),
		makeGrade(50, 40),
		makeGrade(125, 100),
		makeGrade(125, null)
	]

	const calculatedGrade = CourseCard.calculateGrade(grades)
	const formattedGrade = CourseCard.formatGrade(calculatedGrade)

	expect(calculatedGrade).toMatchObject({earned: 190, total: 225})
	expect(formattedGrade).toEqual('B\n(84.44%)')
})

it('should add ridiculous grades up', () => {
	const grades = [
		makeGrade(150, 108),
		makeGrade(66.5, null),
		makeGrade(400, null),
		makeGrade(430, null),
		makeGrade(10000, null),
		makeGrade(50000, 45687),
		makeGrade(25000, 24625),
		makeGrade(4300, 4250),
		makeGrade(4333, 4332.99),
		makeGrade(5500, 4000),
		makeGrade(4030, 4025)
	]

	const calculatedGrade = CourseCard.calculateGrade(grades)
	const formattedGrade = CourseCard.formatGrade(calculatedGrade)

	expect(calculatedGrade).toMatchObject({earned: 87027.99, total: 93313})
	expect(formattedGrade).toEqual(`A\n(93.26%)`)
})

it('should handle empty missing grades', () => {
	const grades = {}

	const calculatedGrade = CourseCard.calculateGrade(grades)
	const formattedGrade = CourseCard.formatGrade(calculatedGrade)

	expect(calculatedGrade).toMatchObject({earned: null, total: null})
	expect(formattedGrade).toEqual('--')
})

it('should handle missing grades array from specific site and still do the other sites', () => {
	const grade = makeGrade(100, 95)

	const gradebook_collection = [
		{
			siteName: 'Innovation Week',
			siteId: '6eec3bc3-dbac-4d5e-ba07-2cd953bcae86'
		},
		{
			siteName: 'Press here to go',
			siteId: 'f7ff9a7e-ee00-4567-a070-63c4fdc20fa9',
			assignments: [grade]
		}
	]

	let state = {...initialState}

	state['f7ff9a7e-ee00-4567-a070-63c4fdc20fa9'] = {
		name: 'Press here to go',
		id: 'f7ff9a7e-ee00-4567-a070-63c4fdc20fa9',
		grades: [grade]
	}

	state['6eec3bc3-dbac-4d5e-ba07-2cd953bcae86'] = {
		name: 'Innovation Week',
		id: '6eec3bc3-dbac-4d5e-ba07-2cd953bcae86',
		grades: []
	}

	expect(gradesReducer(initialState, gradeSuccess(gradebook_collection))).toStrictEqual(state)
})

it('should handle missing site id from gradebook collection', () => {
	let state = initialState
	const badGrade = makeGrade()
	const siteName = 'Learning Outcropping'
	delete badGrade.grade
	const gradebook_collection = [
		{
			assignments: [badGrade],
			siteName
		}
	]

	expect(gradesReducer(state, gradeSuccess(gradebook_collection))).toStrictEqual(state)
})

it('should handle missing site name from gradebook collection', () => {
	let state = initialState
	const badGrade = makeGrade()
	const siteId = 'f1003153-75b9-4abc-bc09-7a0e83d21293'
	delete badGrade.grade
	const gradebook_collection = [
		{
			assignments: [badGrade],
			siteId
		}
	]

	state[siteId] = {
		name: null,
		id: siteId,
		grades: [badGrade]
	}

	expect(gradesReducer(state, gradeSuccess(gradebook_collection))).toMatchObject(state)
})
