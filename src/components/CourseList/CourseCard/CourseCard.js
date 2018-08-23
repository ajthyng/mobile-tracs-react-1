import React, {PureComponent} from 'react'
import {View, TouchableWithoutFeedback, Animated} from 'react-native'
import styled, {withTheme} from 'styled-components'
import {Transition} from 'react-navigation-fluid-transitions'
import {connect} from 'react-redux'

const HEIGHT = 100

const CardBoundary = styled.View`
  height: ${100}px;
  background-color: ${props => props.theme.courseCardBackground};
  margin: 10px;
  border-radius: ${props => props.borderRad || 0};
  flex-direction: row;
  shadow-color: ${props => props.theme.courseCardShadow};
  shadow-offset: 1px 2px;
  shadow-opacity: 0.4;
  shadow-radius: 1px;
  elevation: 3;
  flex: 1;
`

const GradeContainer = styled.View`
  width: ${HEIGHT}px;
  height: ${HEIGHT}px;
  border-top-left-radius: ${props => props.borderRad};
  border-bottom-left-radius: ${props => props.borderRad};
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  background-color: transparent;
  align-items: flex-start;
  flex-direction: row;
`

const SideBar = styled.View`
  width: ${props => props.hasGrade ? HEIGHT : HEIGHT * 0.1};
  height: ${HEIGHT};
  position: absolute;
  left: 0;
  top: 0;
  border-bottom-left-radius: ${props => props.borderRad};
  border-top-left-radius: ${props => props.borderRad};
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  background-color: ${props => props.theme.courseWithGrade};
`

const GradeValueContainer = styled.View`
  flex: 1;
  flex-direction: column;
  height: ${HEIGHT};
  justify-content: center;
  background-color: ${props => props.theme.transparent};
`

const Grade = styled.Text`
  text-align: center;
  color: ${props => props.theme.darkText};
  font-size: 16px;
`

const CourseInfoContainer = styled.View`
  background-color: transparent;
  padding-top: 8px;
  border-top-right-radius: ${props => props.borderRad || 0};
  border-bottom-right-radius: ${props => props.borderRad || 0};
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  flex: 1;
`

const CourseName = styled.Text`
  font-size: 18px;
  margin-left: 8px;
  color: ${props => props.theme.darkText};
  text-align: left;
  background-color: transparent;
`

const CourseInstructor = styled.Text`
  font-size: 14px;
  margin-left: 8px;
  color: ${props => props.theme.darkText};
  text-align: left;
`

const Dash = styled.View`
  background-color: ${props => props.color};
  width: 1px;
  height: 6px;
`

const GradeRightBorder = (props) => {
  const {color, dashStyle} = props
  const segments = Math.ceil(HEIGHT / 10)

  const solid = dashStyle !== 'dash'

  let dashes = []

  for (let i = 0; i < segments; i++) {
    dashes.push(<Dash key={`${i}`} color={color} />)
  }

  return (
    <View style={{justifyContent: 'space-between', alignItems: 'center'}}>
      {solid ? null : dashes}
    </View>
  )
}

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
    const {name, borderRadius, calculatedGrade, mappedGrade, goToCourse, contactInfo: {name: instructor}} = this.props
    const hasGrade = !!calculatedGrade

    const fadeIn = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 1]
    })

    return (
      <Animated.View style={{flex: 1, opacity: fadeIn}}>
        <TouchableWithoutFeedback onPress={goToCourse}>
          <CardBoundary borderRad={borderRadius} >
            <GradeContainer borderRad={borderRadius}>
              <SideBar hasGrade={hasGrade} borderRad={borderRadius} />
              <GradeValueContainer>
                <Grade hasGrade={hasGrade}>{mappedGrade || '--'}</Grade>
                {hasGrade ? <Grade hasGrade={hasGrade}>{calculatedGrade}</Grade> : null}
              </GradeValueContainer>
            </GradeContainer>
            <GradeRightBorder dashStyle={hasGrade ? '' : 'dash'} color={this.props.theme.dashColor} />
            <CourseInfoContainer borderRad={borderRadius}>
              <Transition shared={name}>
                <CourseName numberOfLines={1} ellipsizeMode='tail'>{name}</CourseName>
              </Transition>
              <CourseInstructor numberOfLines={1} ellipsizeMode='tail'>{instructor}</CourseInstructor>
            </CourseInfoContainer>
          </CardBoundary>
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
