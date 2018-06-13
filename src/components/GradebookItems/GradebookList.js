import React, {Component} from 'react'
import {FlatList, Text} from 'react-native'
import styled from 'styled-components'
import dayjs from 'dayjs';
import GradebookItemRow from './GradebookItemRow'

const Container = styled.View`
  flex: 1;
  background-color: transparent;
  align-items: center;
  justify-content: center;
  width: 100%;
`

const data = [{
	key: '0',
	earned: 80,
	total: 90,
	name: 'Gradebook Item 1',
	posted: dayjs().format('MMM DD HH:mm a')
}, {
	key: '1',
	earned: 40,
	total: 90,
	name: 'Gradebook Item 2',
	posted: dayjs().format('MMM DD HH:mm a')
}, {
	key: '2',
	earned: 80,
	total: 100,
	name: 'Gradebook Item 3',
	posted: dayjs().format('MMM DD HH:mm a')
}, {
	key: '3',
	earned: null,
	total: 150,
	name: 'Gradebook Item 4',
	posted: dayjs().format('MMM DD HH:mm a'),
	due: dayjs().format('MMM DD')
}, {
	key: '4',
	earned: 155,
	total: 150,
	name: 'Gradebook Item 5',
	posted: dayjs().format('MMM DD HH:mm a')
}, {
	key: '5',
	earned: 155,
	total: 150,
	name: 'Gradebook Item 6',
	posted: dayjs().format('MMM DD HH:mm a')
}, {
	key: '6',
	earned: 155,
	total: 150,
	name: 'Gradebook Item 7',
	posted: dayjs().format('MMM DD HH:mm a')
}, {
	key: '7',
	earned: 155,
	total: 150,
	name: 'Gradebook Item 8',
	posted: dayjs().format('MMM DD HH:mm a')
}, {
	key: '8',
	earned: null,
	total: 150,
	name: 'Gradebook Item 9',
	posted: dayjs().format('MMM DD HH:mm a'),
	due: dayjs().format('MMM DD')
}]

const TopSpacing = styled.View`
	background-color: transparent;
	height: 16px;
	width: 100%;
`

const renderGradebookItem = ({item}) => (
	<GradebookItemRow data={item} />
)

class GradebookList extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<Container>
				<FlatList
					style={{flex: 1, width: '100%'}}
					data={data}
					renderItem={renderGradebookItem}
					ListHeaderComponent={TopSpacing}
					/>
			</Container>
		)
	}
}

export default GradebookList