/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import React, {PureComponent} from 'react'
import dayjs from 'dayjs'
import styled from 'styled-components'

const DayContainer = styled.View`
	background-color: ${props => props.theme.transparent};
	height: 80px;
	width: 50px;
	margin: 5px;
	align-items: center;
	justify-content: flex-start;
`

const DayNumber = styled.Text`
	color: ${props => props.theme.darkText};
	opacity: 0.63;
	text-align: center;
	width: 100%;
	font-weight: 300;
	font-size: 28px;
`

const ShortMonthName = styled.Text`
	color: ${props => props.theme.darkText};
	opacity: 0.63;
	text-align: center;
	font-size: 18px;
	width: 100%;
`

class CalendarDay extends PureComponent {
  render() {
    const {day} = this.props

    const date = dayjs(day ? day.timestamp : undefined)

    return day ? (
      <DayContainer>
        <DayNumber>{date.format('DD')}</DayNumber>
        <ShortMonthName>{date.format('MMM')}</ShortMonthName>
      </DayContainer>
    ) : <DayContainer />
  }
}

CalendarDay.defaultProps = {
  day: null
}

export default CalendarDay