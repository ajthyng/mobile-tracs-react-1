/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, {Component} from 'react'
import styled, {withTheme} from 'styled-components'


const DueDateContainer = styled.View`
	width: 100%;
	height: 80px;
	background-color: white;
	align-items: center;
	justify-content: flex-end;
	padding-left: 16px;
	padding-right: 16px;
	flex-direction: row;
`

const SideColor = styled.View`
	position: absolute;
	left: 0;
	width: 8px;
	height: 100%;
	background-color: ${props => props.color};
`

const ContentContainer = styled.View`
	flex-direction: column;
	align-items: flex-end;
	justify-content: space-between;
	height: 80px;
	padding: 10px;
`

const DueDateTitle = styled.Text`
	color: ${props => props.theme.darkText};
	font-size: 16px;
	text-align: left;
`

const DueDateCourse = styled.Text`
	color: ${props => props.theme.darkText}80;
	font-size: 12px;
`


class DueDateItem extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		const {item, color} = this.props
		return (
			<DueDateContainer>
				<SideColor color={color} />
				<ContentContainer>
					<DueDateTitle>{item.itemName}</DueDateTitle>
					<DueDateCourse>{item.siteName}</DueDateCourse>
				</ContentContainer>
			</DueDateContainer>
		)
	}
}

DueDateItem.defaultProps = {
	item: {
		itemName: 'No assignment name set',
		siteName: 'Could not find course name'
	},
	color: '#501214'
}

export default withTheme(DueDateItem)