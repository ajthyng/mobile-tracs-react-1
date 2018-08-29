import React, {PureComponent} from 'react'
import {TouchableWithoutFeedback, Animated} from 'react-native'
import styled, {withTheme} from 'styled-components'
import {connect} from 'react-redux'
import Grade from './Grade'
import CourseInfo from './CourseInfo'

const ShadowCard = styled.View`
  height: 80px;
  shadow-color: ${props => props.theme.courseCard.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.4;
  shadow-radius: 2px;
  elevation: 3;
  margin: 15px;
  background-color: transparent;
`

const CardBoundary = styled.View`
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
      extraContent: null,
      animation: new Animated.Value(0)
    }
  }

  componentDidMount () {
    Animated.timing(this.state.animation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true
    }).start()
  }

  render () {
    const {name, color, calculatedGrade, mappedGrade, goToCourse, contactInfo: {name: instructor}} = this.props
    const hasGrade = !!calculatedGrade

    const fadeIn = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 1]
    })

    return (
      <Animated.View style={{flex: 1, opacity: fadeIn}}>
        <TouchableWithoutFeedback onPress={goToCourse}>
          <ShadowCard>
            <CardBoundary>
              <ColorBar color={color} />
              <Grade letterGrade={mappedGrade} percentGrade={calculatedGrade} />
              <CourseInfo name={name} instructor={instructor} />
            </CardBoundary>
          </ShadowCard>
        </TouchableWithoutFeedback>
      </Animated.View>
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
