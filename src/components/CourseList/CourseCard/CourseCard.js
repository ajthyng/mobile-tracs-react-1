import React, {PureComponent} from 'react'
import {Animated, TouchableWithoutFeedback, PanResponder} from 'react-native'
import styled, {withTheme} from 'styled-components'
import {connect} from 'react-redux'
import Grade from './Grade'
import CourseInfo from './CourseInfo'

const ShadowCard = styled.View`
  height: 80px;
  background-color: ${props => props.theme.courseCard.background};
  shadow-color: ${props => props.theme.courseCard.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 2px;
  elevation: 3;
  margin: 15px;
  background-color: transparent;
`

const CardBoundary = styled(Animated.View)`
  height: 100%;
  background-color: ${props => props.theme.courseCard.background};
  border-radius: 2px;
  flex-direction: row;
  flex: 1;
  overflow: hidden;
`

const ColorBar = styled.View`
  height: 100%;
  width: 10px;
  background-color: ${props => props.color || '#000'};
`

class CourseCard extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      pan: new Animated.ValueXY()
    }
  }

  componentDidMount () {
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (e, {dx, dy, vx, vy}) => {
        const xDistance = Math.abs(dx)
        const yDistance = Math.abs(dy)
        const xVelocity = vx
        const yVelocity = Math.abs(vy)

        if (xDistance > yDistance && (xDistance - yDistance > 0 || xVelocity > 100) && yVelocity < 10) {
          this.props.setScroll(false)
          return true
        }

        return false
      },
      onPanResponderGrant: (e, gestureState) => {
        this.state.pan.setValue({x: 0, y: 0})
      },
      onPanResponderTerminationRequest: (e, gestureState) => { return true },
      onPanResponderMove: Animated.event([null, {dx: this.state.pan.x}]),
      onPanResponderTerminate: this.returnToCenter,
      onPanResponderRelease: this.returnToCenter
    })
  }

  returnToCenter = () => {
    this.props.setScroll(true)
    Animated.spring(this.state.pan, {
      toValue: {x: 0, y: 0},
      friction: 10
    }).start()
  }

  render () {
    const {name, color, calculatedGrade, mappedGrade, goToCourse, contactInfo: {name: instructor}} = this.props
    const panResponder = this._panResponder || {}

    const transform = {
      transform: [{
        translateX: this.state.pan.x
      }]
    }

    return (
      <ShadowCard>
        <CardBoundary {...panResponder.panHandlers} style={transform} >
          <TouchableWithoutFeedback onPress={() => console.log('press')}>
            <React.Fragment>
              <ColorBar color={color} />
              <Grade letterGrade={mappedGrade} percentGrade={calculatedGrade} />
              <CourseInfo name={name} instructor={instructor} />
            </React.Fragment>
          </TouchableWithoutFeedback>
        </CardBoundary>
      </ShadowCard>
    )
  }
}

CourseCard.defaultProps = {
  borderRadius: 3,
  name: 'Course Name Not Found',
  instructor: 'Instructor TBA',
  grades: []
}

const mapStateToProps = (state, props) => {
  const siteGrades = state.grades[props.id]
  const grades = (siteGrades || {}).grades || []

  const {calculatedGrade, mappedGrade} = siteGrades || {}

  return {
    grades,
    calculatedGrade,
    mappedGrade,
    siteGrades: siteGrades || {}
  }
}

export default connect(mapStateToProps, null)(withTheme(CourseCard))
