import React, {Component} from 'react'
import {FlatList, View, Text} from 'react-native'

import {Agenda} from 'react-native-calendars'
import {connect} from 'react-redux'
import {setHeaderState} from '../../actions/header'
import styled, {withTheme} from 'styled-components'
import DueDateItem from './DueDateItem'
import EmptyCalendarItem from './EmptyCalendarItem'
import CalendarDay from './CalendarDay'
import dayjs from 'dayjs'
import agendaStyle from '../../../node_modules/react-native-calendars/src/agenda/style'

const ContainerView = styled.View`
	alignItems: flex-start;
	justify-content: center;
	background-color: ${props => props.theme.viewBackground};
	flex: 1;
`

const CalendarView = styled(Agenda)`
	width: 100%;
`

const getRandomColor = (colors) => {
  return colors[Math.floor(Math.random() * 100) % colors.length]
}

const mapColorsToSites = (sites, colors) => {
  return Object.keys(sites).reduce((accum, siteId) => {
    accum[siteId] = getRandomColor(colors)
    return accum
  }, {})
}

const createAssignmentCalendarItems = (assignments) => {
  return assignments.reduce((accum, assign) => {
    const dueDate = dayjs(assign.dueDate).startOf('day').format('YYYY-MM-DD')

    if (!accum[dueDate]) accum[dueDate] = []
    accum[dueDate].push(assign)

    return accum
  }, {})
}

const renderItem = (item, colors) => (
  <DueDateItem item={item} color={colors[item.siteId]} />
)

const renderEmptyDate = () => (
  <EmptyCalendarItem />
)

const renderDay = (day) => <CalendarDay day={day} />

class CalendarScreen extends Component {
  constructor(props) {
    super(props)
    const {sites, theme: {assignments: colors}} = this.props

    this.colorMapping = mapColorsToSites(sites, colors)

    this.state = {
      items: {}
    }

    this.createEmptyItems = this.createEmptyItems.bind(this)
    this.goToGradebook = this.goToGradebook.bind(this)
  }

  goToGradebook() {
    this.props.navigation.navigate('Gradebook')
  }

  createEmptyItems(day) {
    const {assignments} = this.props
    let items = {...createAssignmentCalendarItems(assignments), ...this.state.items}
    const date = dayjs(day.dateString)
    for (let i = 0; i < 60; i++) {
      const visibleDay = date.add(i, 'days')
      const currentDay = visibleDay.format('YYYY-MM-DD')
      if (!items[currentDay]) {
        items[currentDay] = []
      }
    }
    this.setState({items})
  }

  render() {
    const {theme} = this.props
    const style = agendaStyle()

    style.weekday.color = 'red'

    return (
      <ContainerView>
        <CalendarView
          items={this.state.items}
          selected={dayjs().format('YYYY-MM-DD')}
          loadItemsForMonth={this.createEmptyItems}
          renderItem={(item) => renderItem(item, this.colorMapping)}
          renderDay={renderDay}
          renderEmptyDate={renderEmptyDate}
          rowHasChanged={(r1, r2) => r1.itemName !== r2.itemName}
          theme={{...theme.calendar}}
        />
      </ContainerView>
    )
  }
}

CalendarView.navigationOptions = {
  title: 'Calendar'
}

const mapDispatchToProps = (dispatch, props) => ({
  setHeaderState: isCollapsed => {
    if (props.isCollapsed !== isCollapsed) {
      dispatch(setHeaderState(isCollapsed))
    }
  }
})

const gradesWithoutDueDates = grade => {
  const hasDueDate = !!grade.dueDate && grade.dueDate !== null && grade.dueDate !== undefined
  let dueDateIsInFuture
  if (hasDueDate) {
    const dueDate = dayjs(grade.dueDate).startOf('day')
    const today = dayjs().startOf('day')

    dueDateIsInFuture = dueDate.isAfter(today) || dueDate.isSame(today)
  }
  const isNotGraded = grade.grade === null || grade.grade === undefined
  return isNotGraded && dueDateIsInFuture
}

const toGradesArray = (accum, site) => {
  const siteGrades = site.grades.map(grade => {
    grade.siteName = site.name
    grade.siteId = site.id
    return grade
  })
  accum.push(...siteGrades)
  return accum
}

const mapStateToProps = state => {
  let {grades: {grades}} = state
  const gradesSortedByDate = grades
    .reduce(toGradesArray, [])
    .filter(gradesWithoutDueDates)

  return {
    assignments: gradesSortedByDate,
    sites: state.tracsSites.userSites
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(CalendarScreen))