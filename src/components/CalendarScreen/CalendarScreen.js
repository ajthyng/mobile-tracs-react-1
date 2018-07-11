import React, {Component} from 'react'
import {FlatList, View, Text} from 'react-native'

import {Calendar} from 'react-native-calendars'
import {connect} from 'react-redux'
import {setHeaderState} from '../../actions/header'
import styled, {withTheme} from 'styled-components'
import Header from '../CircleHeader/Header'
import ItemSeparator from '../../_components/Notifications/ItemSeparator'
import Ripple from 'react-native-material-ripple'
import dayjs from 'dayjs'
import PullHandle from './PullHandle'

const ContainerView = styled.View`
	alignItems: flex-start;
	justify-content: center;
	background-color: ${props => props.theme.viewBackground};
	flex: 1;
`

const CalendarView = styled(Calendar)`
	width: 100%;
`

const DueDatesList = styled(FlatList)`
	width: 100%;
`

const DueDateContainer = styled(Ripple)`
	width: 100%;
	height: 50px;
	background-color: ${props => props.theme.transparent};
	align-items: center;
	justify-content: space-between;
	padding-left: 16px;
	padding-right: 16px;
	flex-direction: row;
`

const SideColor = styled.View`
	position: absolute;
	left: 0;
	width: 8px;
	height: 50px;
	background-color: ${props => props.color};
`

const ViewAllGrades = styled(Ripple)`
	height: 40px;
	background-color: white;
	align-items: center;
	justify-content: center;
	border-top-color: #36353480;
	border-top-width: 1px;
	width: 100%;
	bottom: 0;
`

const ViewAllGradesText = styled.Text`
	color: ${props => props.theme.darkText};
	font-size: 20px;
`

const getRandomColor = (colors) => {
	return colors[Math.floor(Math.random() * 100) % colors.length]
}

class DueDateItem extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		const {item, color} = this.props
		return (
			<DueDateContainer>
				<SideColor color={color} />
				<View style={{flexDirection: 'column', width: 40, alignItems: 'center', justifyContent: 'center'}}>
					<Text>{dayjs(item.dueDate).format('DD')}</Text>
					<Text>{dayjs(item.dueDate).format('MMM')}</Text>
				</View>
				<View style={{flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center'}}>
					<Text style={{color: '#363534', fontSize: 14}}>{item.itemName}</Text>
					<Text style={{color: '#36353480', fontSize: 12}}>{item.siteName}</Text>
				</View>
			</DueDateContainer>
		)
	}
}

class CalendarScreen extends Component {
	static navigationOptions = {
		title: 'Calendar'
	}

	constructor(props) {
		super(props)
		this.data = props.assignments
		this.colorMapping = Object.keys(props.sites).reduce((accum, siteId) => {
			accum[siteId] = getRandomColor(props.theme.assignments)
			return accum
		}, {})
		console.log(this.colorMapping)
		props.setHeaderState(true)
	}

	goToGradebook = () => {
		this.props.navigation.navigate('Gradebook')
	}

	renderItem = ({item}) => {
		return <DueDateItem item={item} color={this.colorMapping[item.siteId]} />
	}

	render() {
		const {assignments} = this.props

		const markedDates = assignments.reduce((accum, assign) => {
			const dueDate = dayjs(assign.dueDate)

			accum[dueDate.format('YYYY-MM-DD')] = {selected: true, marked: false, selectedColor: this.colorMapping[assign.siteId]}
			return accum
		}, {})

		return (
			<ContainerView>
				<CalendarView
					current={new Date()}
					minDate={'2018-05-01'}
					monthFormat={'MMMM yyyy'}
					markedDates={markedDates}
				/>
				<PullHandle />
				<DueDatesList
					data={this.data}
					ItemSeparatorComponent={() => (<ItemSeparator />)}
					keyExtractor={(item, index) => index.toString(10)}
					renderItem={this.renderItem}
					bounces={false}
				/>
				<ViewAllGrades onPress={this.goToGradebook}>
					<ViewAllGradesText>View All Grades</ViewAllGradesText>
				</ViewAllGrades>
			</ContainerView>
		)
	}
}

const mapDispatchToProps = (dispatch, props) => ({
	setHeaderState: isCollapsed => {
		if (props.isCollapsed !== isCollapsed) {
			dispatch(setHeaderState(isCollapsed))
		}
	}
})

const byDueDate = (a, b) => {
	const dueDateA = dayjs(a.dueDate)
	const dueDateB = dayjs(b.dueDate)

	let order = dueDateA.isBefore(dueDateB) ? -1 : 0
	order = dueDateA.isAfter(dueDateB) ? 1 : order
	return order
}

const mapStateToProps = state => {
	let {grades: {grades}} = state
	const gradesByDate = grades.reduce((accum, site) => {
		const siteGrades = site.grades.map(grade => {
			grade.siteName = site.name
			grade.siteId = site.id
			return grade
		})
		accum.push(...siteGrades)
		return accum
	}, []).filter(grade => {
		const hasDueDate = !!grade.dueDate && grade.dueDate !== null && grade.dueDate !== undefined
		let dueDateIsInFuture
		if (hasDueDate) {
			const dueDate = dayjs(grade.dueDate).startOf('day')
			const today = dayjs().startOf('day')

			dueDateIsInFuture = dueDate.isAfter(today) || dueDate.isSame(today)
		}
		const isNotGraded = grade.grade === null || grade.grade === undefined
		return isNotGraded && dueDateIsInFuture
	}).sort(byDueDate)

	return {
		assignments: gradesByDate,
		sites: state.tracsSites.userSites
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(CalendarScreen))