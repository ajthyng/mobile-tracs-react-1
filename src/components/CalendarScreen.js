import React, {Component} from 'react';
import {FlatList, Text} from 'react-native';

import {Calendar} from 'react-native-calendars';
import styled from 'styled-components';
import Header from './Header/Header';
import ItemSeparator from '../_components/Notifications/ItemSeparator';

const ContainerView = styled.View`
	alignItems: center;
	justify-content: flex-start;
	flex: 1;
	background-color: white;
`;

const CalendarView = styled(Calendar)`
	background-color: white;
	width: 100%;
	flex: 1;
`;

const HeaderSpacer = styled.View`
	height: ${Header.MIN_HEIGHT - 20}px;
`;

const DueDatesList = styled(FlatList)`
	flex: 1;
	width: 100%;
`;

const DueDateItem = styled.View`
	width: 100%;
	height: 50px;
	background-color: transparent;
	align-items: center;
	justify-content: center;
`;

const PullHandle = styled.View`
	width: 100%;
	height: 5px;
	background-color: #363534;
`;

class CalendarScreen extends Component {
	constructor(props) {
		super(props);
		this.data = [
			{key: '0', name: 'Assignment 1'},
			{key: '1', name: 'Assignment 2'},
			{key: '2', name: 'Assignment 3'},
			{key: '3', name: 'Assignment 4'},
			{key: '4', name: 'Assignment 5'},
			{key: '5', name: 'Assignment 6'},
			{key: '6', name: 'Assignment 7'},
			{key: '7', name: 'Assignment 8'},
			{key: '8', name: 'Assignment 9'},
		]
	}

	render() {
		return (
			<ContainerView>
				<HeaderSpacer/>
				<CalendarView
					current={new Date()}
					minDate={'2018-05-01'}
					monthFormat={'MMMM yyyy'}
				/>
				<PullHandle />
				<DueDatesList
					data={this.data}
					ItemSeparatorComponent={() => (<ItemSeparator/>)}
					renderItem={({item}) => (
						<DueDateItem key={item.key}>
							<Text>{item.name}</Text>
						</DueDateItem>
					)}

				/>
			</ContainerView>
		);
	}
}

export default CalendarScreen;