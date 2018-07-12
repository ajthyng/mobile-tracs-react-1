import React, {Component} from 'react'
import {FlatList, View, Text} from 'react-native'

import {Agenda} from 'react-native-calendars'
import {connect} from 'react-redux'
import {setHeaderState} from '../../actions/header'
import styled, {withTheme} from 'styled-components'
import Header from '../CircleHeader/Header'
import ItemSeparator from '../../_components/Notifications/ItemSeparator'
import Ripple from 'react-native-material-ripple'
import dayjs from 'dayjs'

const ContainerView = styled.View`
	alignItems: flex-start;
	justify-content: center;
	background-color: ${props => props.theme.viewBackground};
	flex: 1;
`

const CalendarView = styled(Agenda)`
	width: 100%;
`

const DueDatesList = styled(FlatList)`
	width: 100%;
`

const DueDateContainer = styled(Ripple)`
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
				<View style={{
					flexDirection: 'column',
					alignItems: 'flex-end',
					justifyContent: 'space-between',
					height: 80,
					padding: 10
				}}>
					<Text style={{color: '#363534', fontSize: 16, textAlign: 'left'}}>{item.itemName}</Text>
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

		this.colorMapping = Object.keys(props.sites).reduce((accum, siteId) => {
			accum[siteId] = getRandomColor(props.theme.assignments)
			return accum
		}, {})

		const {assignments} = this.props

		const assignmentsDue = assignments.reduce((accum, assign) => {
			const dueDate = dayjs(assign.dueDate).startOf('day').format('YYYY-MM-DD')

			if (!accum[dueDate]) accum[dueDate] = []
			accum[dueDate].push(assign)

			return accum
		}, {})

		this.state = {
			items: {...assignmentsDue}
		}
	}

	goToGradebook = () => {
		this.props.navigation.navigate('Gradebook')
	}

	renderItem = ({item}) => {
		return <DueDateItem item={item} color={this.colorMapping[item.siteId]} />
	}

	componentDidMount() {

	}

	render() {
		return (
			<ContainerView>
				<CalendarView
					items={this.state.items}
					selected={dayjs().add(6, 'days').format('YYYY-MM-DD')}
					loadItemsForMonth={(day) => {
						let items = {...this.state.items}
						const date = dayjs(day.dateString)
						for (let i = 0; i < 90; i++) {
							const visibleDay = i < 0 ? date.subtract(-i, 'days') : date.add(i, 'days')
							const currentDay = visibleDay.format('YYYY-MM-DD')
							if (!items[currentDay]) {
								items[currentDay] = []
							}
						}

						this.setState({items})
					}}
					renderEmptyDate={() => (
						<View style={{height: 80, backgroundColor: 'transparent', margin: 5}}>
							<View style={{height: 1, width: '100%', marginTop: 15, backgroundColor: '#36353420'}} />
						</View>
					)}
					renderItem={item => (
						<View style={{margin: 5, backgroundColor: 'transparent'}}>
							<DueDateItem item={item} color={this.colorMapping[item.siteId]} />
						</View>
					)}
					renderDay={day => {
						if (day === undefined) {
							return <View
								style={{backgroundColor: 'transparent', height: 80, width: 50, margin: 5, alignItems: 'center'}} />
						}

						const date = dayjs(day.dateString)

						return (
							<View style={{height: 80, width: 50, margin: 5, alignItems: 'center'}}>
								<Text style={{
									color: '#363534A0',
									textAlign: 'center',
									fontWeight: '300',
									fontSize: 28
								}}>{date.format('DD')}</Text>
								<Text style={{
									color: '#363534A0',
									textAlign: 'center',
									fontSize: 18
								}}>{date.format('MMM')}</Text>
							</View>
						)
					}}
					rowHasChanged={(r1, r2) => r1.itemName !== r2.itemName}
				/>
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