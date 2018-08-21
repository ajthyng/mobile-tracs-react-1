import React, {Component} from 'react'
import {Dimensions} from 'react-native'
import ActivityIndicator from '../ActivityIndicator'
import {Agenda} from 'react-native-calendars'
import {connect} from 'react-redux'
import {getAssignments, getAssessments, getCalendarEvents, resetEvents} from '../../actions/calendar'
import {withTheme} from 'styled-components'
import DueDateItem from './DueDateItem'
import EmptyCalendarItem from './EmptyCalendarItem'
import CalendarDay from './CalendarDay'
import dayjs from 'dayjs'
import {CALENDAR, ASSIGNMENT} from '../../constants/calendar'

const renderItem = (item) => (
  <DueDateItem item={item} color='dodgerblue' />
)

const renderEmptyDate = () => (
  <EmptyCalendarItem />
)

const renderDay = (day) => <CalendarDay day={day} />

class CalendarScreen extends Component {
  state = {
    items: {},
    selectedDay: dayjs().valueOf()
  }

  componentDidMount() {
    this.getEvents()
    Dimensions.addEventListener('change', this.scrollCalendar)
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.scrollCalendar)
  }

  componentDidUpdate (prevProps) {
    const wasLoading = prevProps.loading
    const doneLoading = !this.props.loading
    if (wasLoading && doneLoading) {
      this.setState({items: this.props.items})
    }
  }

  getEvents = () => {
    const siteId = this.props.navigation.getParam('siteId', null)
    const siteName = this.props.navigation.getParam('siteName', null)

    if (siteId !== null) {
      this.props.resetEvents()
      this.props.getAssignments(siteId, siteName)
      this.props.getAssessments(siteId)
      this.props.getCalendarEvents(siteId)
    }
  }

  scrollCalendar = () => {
    const calendar = this.agenda.calendar || null
    const offset = (this.agenda && this.agenda.calendarOffset()) || 0
    calendar && calendar.scrollToDay(this.state.selectedDay, offset, false)
  }

  createEmptyItems = (day) => {
    const items = {...this.state.items}
    const date = dayjs(day.timestamp)

    const endOfMonth = date.add(2, 'months').endOf('month')
    const daysToMake = endOfMonth.diff(date, 'days')

    for (let i = 0; i < daysToMake; i++) {
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

    return loading ? <ActivityIndicator /> : (
      <Agenda
        ref={c => this.agenda = c}
        items={items}
        selected={dayjs().valueOf()}
        onDayPress={(day) => {
          this.setState({selectedDay: day.timestamp})
        }}
        loadItemsForMonth={this.createEmptyItems}
        renderItem={renderItem}
        renderDay={renderDay}
        renderEmptyDate={renderEmptyDate}
        rowHasChanged={(r1, r2) => r1.title !== r2.title}
        theme={{...theme.calendar}}
      />
    )
  }
}

const filterDuplicateEvents = (items) => {
  const keys = Object.keys(items) || []
  return keys.reduce((accum, key) => {
    const events = items[key]
    let assignmentIdsCalendar = events
      .filter(({eventType}) => eventType === CALENDAR)
      .filter(({assignmentId}) => assignmentId.length > 0)
      .map(({assignmentId}) => assignmentId)

    accum[key] = events.filter(event => {
      return !(event.eventType === ASSIGNMENT && assignmentIdsCalendar.includes(event.id))
    })

    return accum
  }, {})
}

const mapStateToProps = state => {
  const {loadingAssessments, loadingAssignments, loadingCalendarEvents} = state.calendar
  const loading = loadingAssessments || loadingAssignments || loadingCalendarEvents

  return {
    items: filterDuplicateEvents(state.calendar.aggregate),
    loading,
    sites: state.tracsSites.userSites
  }
}

const mapDispatchToProps = dispatch => ({
  getAssignments: (siteId, siteName) => dispatch(getAssignments(siteId, siteName)),
  getCalendarEvents: (siteId) => dispatch(getCalendarEvents(siteId)),
  getAssessments: (siteId) => dispatch(getAssessments(siteId)),
  resetEvents: () => dispatch(resetEvents())
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(CalendarScreen))