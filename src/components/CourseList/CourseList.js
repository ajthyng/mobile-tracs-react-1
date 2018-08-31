import React, {Component} from 'react'

import {connect} from 'react-redux'
import styled from 'styled-components'
import {toggleStatus} from '../../constants/sites'

import CourseCard from './CourseCard/CourseCard'
import CourseSkeletonCard from './CourseSkeletonCard'

const {ALL_SITES, FAVORITES} = toggleStatus

const Courses = styled.FlatList`
  width: 100%;
`

const CourseListContainer = styled.View`
  flex: 1;
  width: 100%;
`

const loadingSite = <CourseSkeletonCard />

class CourseList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      scroll: true,
      course: {}
    }
  }

  renderCourse = (setScroll) => ({item}) => {
    const isFavorite = this.props.favorites.some(id => item.id === id)
    return (
      <CourseCard
        {...item}
        goToCourse={this.showModal(item)}
        setScroll={setScroll}
        isFavorite={isFavorite}
      />
    )
  }

  setScroll = (enabled) => {
    this.setState({scroll: enabled})
  }

  render () {
    const {refreshing, onRefresh} = this.props
    const {scroll} = this.state
    return (
      <CourseListContainer>
        <Courses
          data={this.props.sites}
          canCancelContentTouches={scroll}
          contentContainerStyle={{marginTop: 10, marginBottom: 10, marginLeft: 0, marginRight: 0}}
          style={{width: '100%'}}
          keyExtractor={item => item.id}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={this.renderCourse(this.setScroll)}
        />
      </CourseListContainer>
    )
  }
}

const mapStateToProps = (state) => {
  const {filterStatus, favorites, userSites} = state.tracsSites
  const {colorBar} = state.theme.colors.courseCard

  const sites = Object.keys(state.tracsSites.userSites).reduce((accum, siteId) => {
    const favoritesFilterActive = filterStatus === FAVORITES
    const allSitesFilterActive = filterStatus === ALL_SITES
    const siteIsFavorite = favorites.includes(siteId)

    if (favoritesFilterActive && siteIsFavorite) {
      const currentLength = accum.length
      const colorOptions = colorBar.length
      const color = colorBar[currentLength % colorOptions]
      accum.push({...userSites[siteId], color})
    } else if (allSitesFilterActive) {
      const color = state.theme.colors.courseCard.defaultColorBar
      accum.push({...userSites[siteId], color})
    }

    return accum
  }, [])

  return {
    sites,
    favorites,
    favoritesFilterActive: filterStatus === FAVORITES,
    theme: state.theme
  }
}

export default connect(mapStateToProps, null)(CourseList)
