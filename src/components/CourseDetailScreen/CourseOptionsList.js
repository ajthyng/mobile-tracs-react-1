import React, {Component} from 'react'
import styled from 'styled-components'
import {FlatList, TouchableWithoutFeedback, StyleSheet} from 'react-native'
import Ripple from 'react-native-material-ripple'

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
`

const OptionsList = styled(FlatList)`
  background-color: #fefefe;
	width: 100%;
	flex: 1;
`

const OptionTouchable = styled(Ripple)`

`

const OptionContainer = styled.View`
	height: 60px;
	align-items: flex-start;
	justify-content: center;
	border-top-color: #36353480;
	border-bottom-color: #36353480;
	border-top-width: ${1}px;
	border-bottom-width: ${1}px;
	
`

const OptionTitle = styled.Text`
	font-size: 24px;
	padding-left: 16px;
	color: #363534;
`

const Separator = styled.View`
	height: 30px;
	background-color: transparent;
`

const options = [
	{
		key: '0',
		title: 'All Gradebook Items'
	},
	{
		key: '1',
		title: 'View Course Website'
	},
	{
		key: '2',
		title: 'Recent Announcements'
	},
	{
		key: '3',
		title: 'Recent Forum Posts'
	}
]

class CourseOptionsList extends Component {
	constructor(props) {
		super(props)
	}

	renderOptionRow = ({item}) => (
		<OptionTouchable>
			<OptionContainer>
				<OptionTitle>{item.title}</OptionTitle>
			</OptionContainer>
		</OptionTouchable>
	)

	render() {
		return (
			<Container style={this.props.style}>
				<OptionsList
					data={options}
					ItemSeparatorComponent={Separator}
					renderItem={this.renderOptionRow}
				/>
			</Container>
		)
	}
}

export default CourseOptionsList