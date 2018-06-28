/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {haxios as axios} from '../utils/networking'
import {gradesActions} from '../constants/actions'

const {
	REQUEST_GRADES,
	GRADES_SUCCESS,
	GRADES_FAILURE
} = gradesActions

const requestGrades = () => ({
	type: REQUEST_GRADES
})

const gradesSuccess = (grades) => ({
	type: GRADES_SUCCESS,
	grades
})

const gradesFailure = (error) => ({
	type: GRADES_FAILURE,
	error
})

export const getGrades = (dispatch) => (
	async (dispatch) => {
		const start = new Date()
		dispatch(requestGrades())

		const url = `${global.urls.baseUrl}${global.urls.grades}`

		axios(url, {method: 'get'}).then(res => {
			const {gradebook_collection} = res.data
			dispatch(gradesSuccess(gradebook_collection))
		}).catch(err => {
			dispatch(gradesFailure(err))
		})
	}
)