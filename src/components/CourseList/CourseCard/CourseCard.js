import React, {Component} from 'react'
import {Animated, Dimensions, View, TouchableWithoutFeedback, Vibration, Platform, TouchableOpacity, PanResponder} from 'react-native'
import styled, {withTheme} from 'styled-components'
import {connect} from 'react-redux'
import Grade from './Grade'
import CourseInfo from './CourseInfo'
import Icon from 'react-native-vector-icons/FontAwesome'
import {toggleStatus} from '../../../constants/sites'

const {FAVORITES} = toggleStatus
const OPEN_WIDTH = -100
const HEIGHT = 80
const LONG_PRESS_VIBRATION = Platform.select({
  ios: 100,
  android: 200
})

const ButtonContainer = styled(TouchableOpacity)`
  height: 100%;
  width: 100px;
  align-items: center;
  justify-content: center;
`

const IconLabel = styled.Text`
  font-size: 10px;
  color: white;
  text-align: center;
`

const Background = styled.View`
  position: absolute;
  right: 0;
  height: ${HEIGHT}px;
  width: ${props => props.cardWidth}px;
  margin: 10px;
  border-radius: 3px;
  background-color: ${props => props.color};
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
`

const CardSwipe = styled(Animated.View)`
  height: ${HEIGHT}px;
  margin: 10px;
`

const CardBoundary = styled.View`
  height: 100%;
  flex-direction: row;
  background-color: ${props => props.theme.courseCard.background};
  border-radius: 2px;
  border: solid ${props => props.new ? '2' : Platform.select({ios: '0', android: '1'})}px ${props => props.color};
  shadow-color: ${props => props.theme.courseCard.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 3px;
`

const ColorBar = styled.View`
  height: 100%;
  width: 10px;
  background-color: ${props => props.color || '#000'};
  border-top-left-radius: ${props => props.new ? '0' : '2'}px;
  border-bottom-left-radius: ${props => props.new ? '0' : '2'}px;
`

class CourseCard extends Component {
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
    if (this.state.isOpen) {
      this.closeCard()
    } else {
      this.props.onPress && this.props.onPress()
    }
  }

  canPressBackground = () => {
    const {favoritesFilterActive, course} = this.props
    const viewingAllSitesAndCourseIsNotFavorite = !favoritesFilterActive && !course.isFavorite
    const viewingFavorites = favoritesFilterActive
    return viewingAllSitesAndCourseIsNotFavorite || viewingFavorites
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
      isFavorite,
      id,
      hasNewContent,
      contactInfo: {name: instructor}
    } = this.props.course

    const {cardWidth} = this.state

    const transform = {
      transform: [{
        translateX: this.state.pan.x
      }]
    }

    const iconName = isFavorite ? 'eye-slash' : 'star'

    let iconLabel = 'ALREADY ADDED\nTO FAVORITES'
    const canPressBackground = this.canPressBackground()
    if (canPressBackground) {
      iconLabel = (isFavorite ? 'REMOVE FROM' : 'ADD TO') + '\nFAVORITES'
    }

    return (
      <View>
        <Background cardWidth={cardWidth} color={color} >
          <ButtonContainer onPress={this.updateFavorite(id)}>
            {canPressBackground ? <Icon ref='icon' name={iconName} color='white' size={24} /> : null}
            <IconLabel>{iconLabel}</IconLabel>
          </ButtonContainer>
        </Background>
        <CardSwipe style={transform} >
          <TouchableWithoutFeedback onPress={this.onPress} onLongPress={this.openCard}>
            <CardBoundary color={color} new={hasNewContent} >
              <ColorBar color={color} new={hasNewContent} />
              <Grade letterGrade={mappedGrade} percentGrade={calculatedGrade} />
              <CourseInfo name={name} instructor={instructor} hasNewContent={hasNewContent} />
            </CardBoundary>
          </TouchableWithoutFeedback>
        </CardSwipe>
      </View>
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
