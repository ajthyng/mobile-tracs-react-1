/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
const grades = require('../responses/grades/gradeFactory')
const {importGrade} = grades

const csvParser = require('csv-parse')
const fs = require('fs')
const path = require('path')

const filepath = path.join(__dirname, 'gradebook_collection.csv')

export default async function readGrades() {
	return new Promise((resolve, reject) => {
		fs.readFile(filepath, {encoding: 'utf-8'}, (err, csvData) => {
			if (err) {
				reject(err)
			}

			csvParser(csvData, {delimiter: ','}, function (err, data) {
				if (err) {
					reject(err)
				}
				else {
					const pointsPattern = new RegExp(/\[[0-9]*]$/)
					let pointTotals = []
					let gradeCollection = []
					let calculatedRow = null

					data[0].forEach((entry, index) => {
						const match = entry.match(pointsPattern)
						const pointTotal = match ? parseFloat(match[0].split('').slice(1, match[0].length - 1).join('')) : null
						if (entry === '# Calculated Grade') {
							calculatedRow = index
						}
						pointTotals.push(pointTotal)
					})

					data.slice(1).forEach(row => {
						let totalPoints = 0
						let earnedPoints = 0
						let userGrades = row.reduce((accum, grade, index) => {
							if (pointTotals[index] !== null) { //This is a grade item
								if ((grade || '').length !== 0) { //This is a graded grade item
									accum.push(importGrade({
											points: pointTotals[index],
											grade: parseFloat(grade),
											itemName: data[0][index]
										})
									)
									totalPoints += data[0][index].startsWith('ExCr:') ? 0 : pointTotals[index]
									earnedPoints += parseFloat(grade)
								}
							}
							return accum
						}, [])
						gradeCollection.push({
							student: userGrades,
							earned: earnedPoints,
							total: totalPoints,
							calculated: parseFloat(row[calculatedRow])
						})
					})
					return resolve(gradeCollection)
				}
			})
		})
	})
}
