/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const defaultTheme = {
	header: '#224575',
	selectedHeader: '#4a89f4',
	androidStatusBar: '#224575',
	courseWithGrade: '#4a89f4',
	courseWithoutGrade: '#4a89f4',
	courseCardBackground: '#ffffff',
	courseCardShadow: '#142945',
	darkText: '#363534',
	lightText: '#fff',
	dashColor: '#36353440',
	notificationBadge: '#ff3b30',
	viewBackground: '#ffffff',
	transparent: 'transparent',
	viewCourseButton: '#1E90FF',
	courseScreenBorder: '#b0b0b080',
	courseScreenShadow: '#b0b0b0',
	courseScreenTitleSeparator: '#808080',
	gradeSummaryBackground: '#ffffff',
	gradebookBackground: '#ffffff',
	screenHeaderBorder: '#36353480',
	gradeSummaryContainerBorder: '#36353480',
	gradeItemQuotient: '#D3D3D3',
	toggleOn: '#4a89f4',
	toggleTint: '#b0b0b0',
	assignments: [
		'#fe4880',
		'#6953c6',
		'#3aba3b',
		'#bdae2d',
		'#e17409',
	]
}

const darkTheme = {
  header: '#501214',
  selectedHeader: '#4a89f4',
  androidStatusBar: '#501214',
  courseWithGrade: '#4a89f4',
  courseWithoutGrade: '#4a89f4',
  courseCardBackground: '#ffffff',
  courseCardShadow: '#142945',
  darkText: '#fff',
  lightText: '#363534',
  dashColor: '#36353440',
  notificationBadge: '#ff3b30',
  viewBackground: '#232323',
  transparent: 'transparent',
  viewCourseButton: '#1E90FF',
  courseScreenBorder: '#b0b0b080',
  courseScreenShadow: '#b0b0b0',
  courseScreenTitleSeparator: '#808080',
  gradeSummaryBackground: '#ffffff',
  gradebookBackground: '#ffffff',
  screenHeaderBorder: '#36353480',
  gradeSummaryContainerBorder: '#36353480',
  gradeItemQuotient: '#D3D3D3',
  toggleOn: '#4a89f4',
  toggleTint: '#b0b0b0',
  assignments: [
    '#fe4880',
    '#6953c6',
    '#3aba3b',
    '#bdae2d',
    '#e17409',
  ]
}

const blackAndWhite = {
	header: '#737373',
	selectedHeader: '#a3a3a3',
	androidStatusBar: '#737373',
	courseWithGrade: '#a3a3a3',
	courseWithoutGrade: '#a3a3a3',
	viewCourse: '#4a4a4a',
	darkText: '#363534',
	lightText: '#fff',
	notificationBadge: '#a0a0a0',
	assignments: [
		'#111111',
		'#333333',
		'#555555',
		'#777777',
		'#999999',
	]
}

module.exports = { defaultTheme, darkTheme }
