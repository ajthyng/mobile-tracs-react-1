/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * Creates a single grade item based on values returned from TRACS
 * @param grade Graded point value
 * @param points Total points obtainable
 * @param postedDate Datestamp in ms
 * @param comment Comments on the graded item
 * @returns {{dueDate: number, itemName: string, userId: string, userName: string, points: number, postedDate: *, grade: *, comment: *}}
 */
const makeGrade = (points = 50, grade = null, postedDate = null, comment = null) => ({
	dueDate: new Date().valueOf(),
	itemName: `Gradebook Item ${Math.floor(Math.random() * 1000)}`,
	userId: '851252b0-553a-44c7-9483-01bcc24d78da',
	userName: 'Lillian Walker',
	points,
	postedDate,
	grade,
	comment
})

const importGrade = (args) => {
	return {
		...args,
		postedDate: new Date().valueOf(),
		userId: null,
		userName: null,
		comment: null,
		dueDate: new Date().valueOf()
	}
}

module.exports = {
	makeGrade,
	importGrade
}