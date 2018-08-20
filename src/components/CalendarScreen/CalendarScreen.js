import React, {Component} from 'react'
import {FlatList, Dimensions, View, Text} from 'react-native'
import ActivityIndicator from '../ActivityIndicator'
import {Agenda} from 'react-native-calendars'
import {connect} from 'react-redux'
import {getAssignments, getAssessments, getCalendarEvents} from '../../actions/calendar'
import styled, {withTheme} from 'styled-components'
import DueDateItem from './DueDateItem'
import EmptyCalendarItem from './EmptyCalendarItem'
import CalendarDay from './CalendarDay'
import dayjs from 'dayjs'

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
  <DueDateItem item={item} color='dodgerblue' />
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
    const siteName = this.props.navigation.getParam('siteName', null)
    if (siteId !== null) {
      this.props.getAssignments(siteId, siteName)
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
    const {items: assignments} = this.props
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
    const {theme, loading} = this.props
    const {items} = this.state

    return loading ? <ActivityIndicator/> : (
      <Agenda
        ref={c => this.agenda = c}
        items={items}
        selected={dayjs().valueOf()}
        onDayPress={(day) => {
          this.setState({selectedDay: day.timestamp})
        }}
        loadItemsForMonth={this.createEmptyItems}
        renderEmptyData={() => <ActivityIndicator />}
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

const mapStateToProps = state => {
  const {loadingAssessments, loadingAssignments, loadingCalendarEvents} = state.calendar
  const loading = loadingAssessments || loadingAssignments || loadingCalendarEvents

  const calendarItems = state.calendar.calendarEvents.reduce((accum, item) => {
    const eventDate = dayjs(item.firstTime.time).startOf('day').format('YYYY-MM-DD')
    if (!accum[eventDate]) accum[eventDate] = []
    accum[eventDate].push(item)
    return accum
  }, {})

  const assignments = state.calendar.assignments.reduce((accum, item) => {
    const open = dayjs(item.openTime.time).startOf('day').format('YYYY-MM-DD')
    const due = dayjs(item.dueTime.time).startOf('day').format('YYYY-MM-DD')
    const close = dayjs(item.closeTime.time).startOf('day').format('YYYY-MM-DD')

    if (!accum[open]) accum[open] = []
    if (!accum[due]) accum[due] = []
    if (!accum[close]) accum[close] = []

    accum[open].push({...item, event: 'open'})
    accum[due].push({...item, event: 'due'})
    accum[close].push({...item, event: 'close'})

    return accum
  }, calendarItems)

  const assessments = state.calendar.assessments.reduce((accum, item) => {
    const open = dayjs(item.startDate).startOf('day').format('YYYY-MM-DD')
    const due = dayjs(item.dueDate).startOf('day').format('YYYY-MM-DD')

    if (!accum[open]) accum[open] = []
    if (!accum[due]) accum[due] = []

    accum[open].push({...item, event: 'open'})
    accum[due].push({...item, event: 'due'})

    return accum
  }, assignments)

  console.log(assessments)

  return {
    items: [],
    loading,
    sites: state.tracsSites.userSites
  }
}

const mapDispatchToProps = dispatch => ({
  getAssignments: (siteId, siteName) => dispatch(getAssignments(siteId, siteName)),
  getCalendarEvents: (siteId) => dispatch(getCalendarEvents(siteId)),
  getAssessments: (siteId) => dispatch(getAssessments(siteId))
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(CalendarScreen))