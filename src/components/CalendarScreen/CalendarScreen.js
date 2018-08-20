import React, {Component} from 'react'
import {FlatList, Dimensions, View, Text} from 'react-native'
import {Agenda} from 'react-native-calendars'
import {connect} from 'react-redux'
import {getAssignments, getAssessments, getCalendarEvents} from '../../actions/calendar'
import styled, {withTheme} from 'styled-components'
import DueDateItem from './DueDateItem'
import EmptyCalendarItem from './EmptyCalendarItem'
import CalendarDay from './CalendarDay'
import dayjs from 'dayjs'

const ContainerView = styled.View`
	alignItems: flex-start;
	justify-content: center;
	flex: 1;
	background-color: ${props => props.theme.viewBackground};
`

const CalendarView = styled(Agenda)``

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
      items: {},
      selectedDay: dayjs().valueOf()
    }

    this.createEmptyItems = this.createEmptyItems.bind(this)
    this.goToGradebook = this.goToGradebook.bind(this)
  }

  componentDidMount() {
    const siteId = this.props.navigation.getParam('siteId', null)

    if (siteId !== null) {
      this.props.getAssignments(siteId)
      this.props.getAssessments(siteId)
      this.props.getCalendarEvents(siteId)
    }

    Dimensions.addEventListener('change', this.scrollCalendar)
  }

  componentWillUnmount () {
    Dimensions.removeEventListener('change', this.scrollCalendar)
  }

  scrollCalendar = () => {
    const calendar = this.agenda.calendar || null
    const offset = (this.agenda && this.agenda.calendarOffset()) || 0
    calendar && calendar.scrollToDay(this.state.selectedDay, offset, false)
  }

  goToGradebook() {
    this.props.navigation.navigate('Gradebook')
  }

  createEmptyItems(day) {
    const {assignments} = this.props
    let items = {...createAssignmentCalendarItems(assignments), ...this.state.items}
    const date = dayjs(day.dateString)
    for (let i = 0; i < 35; i++) {
      const visibleDay = date.add(i, 'days').format('YYYY-MM-DD')
      if (!items[visibleDay]) {
        items[visibleDay] = []
      }
    }
    this.setState({items})
  }

  render() {
    const {theme} = this.props
    const {items} = this.state

    return (
      <Agenda
        ref={c => this.agenda = c}
        items={items}
        selected={dayjs().valueOf()}
        onDayPress={(day) => {
          this.setState({selectedDay: day.timestamp})
        }}
        loadItemsForMonth={this.createEmptyItems}
        renderItem={(item) => renderItem(item, this.colorMapping)}
        renderDay={renderDay}
        renderEmptyDate={renderEmptyDate}
        rowHasChanged={(r1, r2) => r1.itemName !== r2.itemName}
        theme={{...theme.calendar}}
      />
    )
  }
}

CalendarView.navigationOptions = {
  title: 'Calendar'
}

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
  const {loadingAssessments, loadingAssignments, loadingCalendarEvents} = state.calendar
  const loading = loadingAssessments || loadingAssignments || loadingCalendarEvents

  return {
    assignments: [],
    loading,
    sites: state.tracsSites.userSites
  }
}

const mapDispatchToProps = dispatch => ({
  getAssignments: () => dispatch(getAssignments()),
  getCalendarEvents: () => dispatch(getCalendarEvents()),
  getAssessments: () => dispatch(getAssessments())
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(CalendarScreen))