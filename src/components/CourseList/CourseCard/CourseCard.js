import React, { PureComponent } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import styled, { withTheme } from 'styled-components'
import { connect } from 'react-redux'
import Grade from './Grade'
import CourseInfo from './CourseInfo'
import Star from './Star'
import { toggleStatus } from '../../../constants/sites'

const { FAVORITES } = toggleStatus

const CardBoundary = styled.View`
  flex-direction: row;
  background-color: ${props => props.theme.courseCard.background};
  border-radius: 2px;
  margin: 10px;
  border: solid ${props => props.new ? '2' : '0'}px ${props => props.color};
  shadow-color: ${props => props.theme.courseCard.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 3px;
  elevation: 3;
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
  onPress = () => {
    this.props.onPress && this.props.onPress()
  }

  render () {
    const {
      name,
      color,
      calculatedGrade,
      mappedGrade,
      overrideGrade,
      hasNewContent,
      isFavorite,
      contactInfo: { name: faculty }
    } = this.props.course

    const { favoritesFilterActive, onFavorite } = this.props

    return (
      <TouchableWithoutFeedback {...this.props} onPress={this.onPress} accessible={false}>
        <CardBoundary color={color} new={hasNewContent}>
          <ColorBar color={color} new={hasNewContent} />
          <Grade letterGrade={overrideGrade || mappedGrade} percentGrade={calculatedGrade} />
          <CourseInfo name={name} faculty={faculty} hasNewContent={hasNewContent} />
          {favoritesFilterActive ? null : <FavoriteStar active={isFavorite} onPress={onFavorite} name={name} />}
        </CardBoundary>
      </TouchableWithoutFeedback>
    )
  }
}

CourseCard.defaultProps = {
  course: {
    contactInfo: { name: 'Faculty TBA' },
    isFavorite: false,
    hasNewContent: false,
    color: '#808080',
    name: 'Course Name Not Set'
  }
}

const mapStateToProps = (state, props) => {
  const { filterStatus } = state.tracsSites
  const { calculatedGrade, mappedGrade, overrideGrade } = state.grades[props.id] || {}

  console.log(state.grades[props.id])

  return {
    calculatedGrade,
    overrideGrade,
    mappedGrade,
    favoritesFilterActive: filterStatus === FAVORITES
  }
}

export default connect(mapStateToProps, null)(withTheme(CourseCard))
