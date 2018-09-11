import React, {Component} from 'react'
import {Animated, Dimensions, View, TouchableWithoutFeedback, Vibration, Platform, TouchableOpacity, PanResponder} from 'react-native'
import styled, {withTheme} from 'styled-components'
import {connect} from 'react-redux'
import Grade from './Grade'
import CourseInfo from './CourseInfo'
import Icon from 'react-native-vector-icons/FontAwesome'

const OPEN_WIDTH = -100
const HEIGHT = 80
const LONG_PRESS_VIBRATION = Platform.select({
  ios: 100,
  android: 200
})

const ShadowCard = styled.View`
  height: ${HEIGHT}px;
  shadow-color: ${props => props.theme.courseCard.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 3px;
  margin: 15px;
`

const CardSwipe = styled(Animated.View)`
  flex: 1;
`

const CardBoundary = styled.View`
  height: 100%;
  background-color: ${props => props.theme.courseCard.background};
  border-radius: 2px;
  flex-direction: row;
  flex: 1;
  overflow: hidden;
  border: solid ${props => props.new ? '2' : Platform.select({ios: '0', android: '1'})}px ${props => props.color};
`

const ColorBar = styled.View`
  height: 100%;
  width: 10px;
  background-color: ${props => props.color || '#000'};
`

class CourseCard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      pan: new Animated.ValueXY(),
      cardWidth: Dimensions.get('window').width - 30,
      isOpen: false,
      offset: 0
    }
    this.sensitivity = 25
  }

  componentDidMount () {
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: (e, {dx, dy, vx, vy}) => {
        const xDistance = Math.abs(dx)
        const yDistance = Math.abs(dy)

        const xMovement = xDistance > this.sensitivity
        const noYMovement = yDistance <= this.sensitivity

        const {isOpen} = this.state
        const shouldMove = dx < 0 || (dx > 0 && isOpen)

        if (xMovement && noYMovement && shouldMove) {
          this.props.setScroll(false)
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
  }

  resetCard = () => {
    this.props.setScroll(true)
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

  updateFavorite = (id) => () => {
    this.props.updateFavorite && this.props.updateFavorite(id)
    this.closeCard()
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
    } = this.props

    const {cardWidth} = this.state
    const panResponder = this._panResponder || {}

    const transform = {
      transform: [{
        translateX: this.state.pan.x
      }]
    }

    const iconName = isFavorite ? 'eye-slash' : 'star'

    return (
      <View>
        <Background cardWidth={cardWidth} color={this.props.color} >
          <ButtonContainer onPress={this.updateFavorite(id)}>
            <Icon ref='icon' name={iconName} color='white' size={24} />
            <IconLabel>{isFavorite ? 'REMOVE FROM' : 'ADD TO'}{'\n'}FAVORITES</IconLabel>
          </ButtonContainer>
        </Background>
        <ShadowCard pointerEvents='box-none'>
          <CardSwipe {...panResponder.panHandlers} style={transform} >
            <TouchableWithoutFeedback onPress={this.onPress} onLongPress={this.openCard}>
              <CardBoundary color={color} new={hasNewContent} >
                <ColorBar color={color} />
                <Grade letterGrade={mappedGrade} percentGrade={calculatedGrade} />
                <CourseInfo name={name} instructor={instructor} hasNewContent={hasNewContent} />
              </CardBoundary>
            </TouchableWithoutFeedback>
          </CardSwipe>
        </ShadowCard>
      </View>
    )
  }
}

const ButtonContainer = styled(TouchableOpacity)`
  height: 100%;
  width: 100px;
  align-items: center;
  justify-content: center;
  z-index: 0;
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
  margin: 15px;
  border-radius: 3px;
  background-color: ${props => props.color};
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
`

CourseCard.defaultProps = {
  borderRadius: 3,
  name: 'Course Name Not Found',
  instructor: 'Instructor TBA',
  grades: [],
  favorites: []
}

const mapStateToProps = (state, props) => {
  const siteGrades = state.grades[props.id]
  const grades = (siteGrades || {}).grades || []
  const favorites = state.tracsSites.favorites || []

  const {calculatedGrade, mappedGrade} = siteGrades || {}

  return {
    favs: favorites,
    grades,
    calculatedGrade,
    mappedGrade,
    siteGrades: siteGrades || {}
  }
}

export default connect(mapStateToProps, null)(withTheme(CourseCard))
