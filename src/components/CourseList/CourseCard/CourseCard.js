import React, {PureComponent} from 'react'
import {Animated, Dimensions, TouchableWithoutFeedback, Vibration, Platform, PanResponder} from 'react-native'
import styled, {withTheme} from 'styled-components'
import {connect} from 'react-redux'
import Grade from './Grade'
import CourseInfo from './CourseInfo'
import Star from './Star'
import {toggleStatus} from '../../../constants/sites'

const {FAVORITES} = toggleStatus
const OPEN_WIDTH = -100
const LONG_PRESS_VIBRATION = Platform.select({
  ios: 100,
  android: 200
})

const CardBoundary = styled.View`
  flex-direction: row;
  background-color: ${props => props.theme.courseCard.background};
  border-radius: 2px;
  margin: 10px;
  border: solid ${props => props.new ? '2' : Platform.select({ios: '0', android: '1'})}px ${props => props.color};
  shadow-color: ${props => props.theme.courseCard.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 3px;
`

const ColorBar = styled.View`
  width: 10px;
  background-color: ${props => props.color || '#000'};
  border-top-left-radius: ${props => props.new ? '0' : '2'}px;
  border-bottom-left-radius: ${props => props.new ? '0' : '2'}px;
`

const FavoriteStar = styled(Star)`
  padding: 10px;
`

class CourseCard extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      pan: new Animated.ValueXY(),
      panResponder: null,
      cardWidth: Dimensions.get('window').width - 30,
      isOpen: false,
      offset: 0
    }
    this.sensitivity = 25
  }

  _panResponder = PanResponder.create({
    onMoveShouldSetPanResponderCapture: (e, {dx, dy, vx, vy}) => {
      const xDistance = Math.abs(dx)
      const yDistance = Math.abs(dy)

      const xMovement = xDistance > this.sensitivity
      const noYMovement = yDistance <= this.sensitivity

      const {isOpen} = this.state
      const shouldMove = dx < 0 || (dx > 0 && isOpen)

      if (xMovement && noYMovement && shouldMove) {
        this.props.setScroll && this.props.setScroll(false)
        return true
      }

      return false
    },
    onPanResponderGrant: (e, gestureState) => {
      this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value})
      this.state.pan.setValue({x: 0, y: 0})
    },
    onPanResponderTerminationRequest: () => true,
    onPanResponderMove: (e, gestureState) => {
      const {isOpen} = this.state
      const {dx} = gestureState
      if (isOpen && dx > 100) return
      if (!isOpen && dx > 0) return
      return Animated.event([null, {dx: this.state.pan.x}])(e, gestureState)
    },
    onPanResponderTerminate: this.resetCard,
    onPanResponderRelease: (e, gestureState) => {
      this.state.pan.flattenOffset()
      this.snapCard(e, gestureState)
    }
  })

  resetCard = () => {
    this.props.setScroll && this.props.setScroll(true)
    this.setState({isOpen: false}, () => this.setCardTo(0))
  }

  setCardTo = (value) => {
    Animated.spring(this.state.pan, {
      toValue: {x: value, y: 0},
      duration: 200,
      friction: 10
    }).start()
  }

  snapCard = (e, {dx}) => {
    this.props.setScroll(true)
    const {isOpen} = this.state

    if (dx < -50 && !isOpen) {
      this.setState({isOpen: true}, () => this.setCardTo(OPEN_WIDTH))
    }
    if (dx < 0 && isOpen) {
      this.setCardTo(OPEN_WIDTH)
    }
    if (dx < 0 && dx >= -50 && !isOpen) {
      this.setCardTo(0)
    }
    if (dx > 0 && isOpen) {
      if (dx > 50) {
        this.setState({isOpen: false}, () => this.setCardTo(0))
      } else {
        this.setCardTo(OPEN_WIDTH)
      }
    }

    if (dx > 0 && !isOpen) {
      this.setCardTo(0)
    }
  }

  closeCard = () => {
    this.setState({isOpen: false}, this.resetCard())
  }

  openCard = () => {
    Vibration.vibrate(LONG_PRESS_VIBRATION)
    this.setState({isOpen: true}, () => this.setCardTo(OPEN_WIDTH))
  }

  onPress = () => {
    this.props.onPress && this.props.onPress()
  }

  updateFavorite = (id) => () => {
    if (this.canPressBackground()) {
      this.props.updateFavorite && this.props.updateFavorite(id)
      this.closeCard()
    }
  }

  render () {
    const {
      name,
      color,
      calculatedGrade,
      mappedGrade,
      hasNewContent,
      isFavorite,
      contactInfo: {name: instructor}
    } = this.props.course

    const {favoritesFilterActive, onFavorite} = this.props

    return (
      <TouchableWithoutFeedback onPress={this.onPress}>
        <CardBoundary color={color} new={hasNewContent} >
          <ColorBar color={color} new={hasNewContent} />
          <Grade letterGrade={mappedGrade} percentGrade={calculatedGrade} />
          <CourseInfo name={name} instructor={instructor} hasNewContent={hasNewContent} />
          {favoritesFilterActive ? null : <FavoriteStar active={isFavorite} onPress={onFavorite} />}
        </CardBoundary>
      </TouchableWithoutFeedback>
    )
  }
}

CourseCard.defaultProps = {
  borderRadius: 3,
  name: 'Course Name Not Found',
  instructor: 'Instructor TBA',
  grades: [],
  favorites: []
}

const mapStateToProps = (state, props) => {
  const {filterStatus} = state.tracsSites
  const siteGrades = state.grades[props.id]
  const grades = (siteGrades || {}).grades || []
  const favorites = state.tracsSites.favorites || []

  const {calculatedGrade, mappedGrade} = siteGrades || {}

  return {
    favs: favorites,
    grades,
    calculatedGrade,
    mappedGrade,
    favoritesFilterActive: filterStatus === FAVORITES,
    siteGrades: siteGrades || {}
  }
}

export default connect(mapStateToProps, null)(withTheme(CourseCard))
