import React, {Component} from 'react'
import {Dimensions} from 'react-native'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {toggleStatus} from '../../constants/sites'
import {getFavorites, updateFavorites} from '../../actions/sites'

import CourseCard from './CourseCard/CourseCard'
import CourseSkeletonCard from './CourseSkeletonCard'
import EmptyCourseList from './EmptyCourseList'

const {ALL_SITES, FAVORITES} = toggleStatus

const Courses = styled.FlatList`
  width: 100%;
`

const CourseListContainer = styled.View`
  flex: 1;
  width: 100%;
`

class CourseList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      scroll: true,
      course: {}
    }
  }

  isFavorite = (id) => this.props.favorites.some(favId => favId === id)

  updateFavorite = (id) => {
    const {favorites, isUpdatingFavorites} = this.props
    if (isUpdatingFavorites) return

    const isFavorite = this.isFavorite(id)
    if (isFavorite) {
      const ids = favorites.filter(favId => favId !== id)
      this.props.updateFavorites(ids)
    } else {
      favorites.splice(favorites.length, 0, id)
      this.props.updateFavorites(favorites)
    }
  }

  goToCourse = (course) => () => {
    const {navigation: {navigate}} = this.props
    navigate('CourseDetail', {
      transition: 'cardFromRight',
      course
    })
  }

  makeData = () => {
    let sites = []
    if (this.props.sites.length === 0 && this.props.loading) {
      const cardsToRender = Math.floor(1.2 * Dimensions.get('window').height / 80)
      for (let i = 0; i < cardsToRender; i++) {
        const id = i.toString(10)
        sites.push({
          component: (
            <CourseSkeletonCard ref={id} />
          ),
          key: id,
          cardRef: id
        })
      }
    } else {
      sites = this.props.sites.map(course => {
        const isFavorite = this.isFavorite(course.id)
        return {
          component: (
            <CourseCard
              {...course}
              ref={course.id}
              setScroll={this.setScroll}
              isFavorite={isFavorite}
              updateFavorite={this.updateFavorite}
              onPress={this.goToCourse(course)}
            />
          ),
          key: course.id,
          cardRef: course.id
        }
      })
    }
    return sites
  }

  setScroll = (enabled) => {
    this.setState({scroll: enabled})
  }

  componentDidUpdate (prevProps) {
    const oldFilter = prevProps.favoritesFilterActive
    const newFilter = this.props.favoritesFilterActive
    if (oldFilter !== newFilter) {
      if (this.siteData) {
        this.siteData.forEach(({cardRef}) => this.refs[cardRef].forceUpdate())
      }
    }
  }

  render () {
    const {refreshing, onRefresh} = this.props
    this.siteData = this.makeData()
    const {scroll} = this.state
    return (
      <CourseListContainer>
        <Courses
          data={this.siteData}
          ListEmptyComponent={EmptyCourseList}
          canCancelContentTouches={scroll}
          contentContainerStyle={{marginTop: 10, marginBottom: 10, marginLeft: 0, marginRight: 0}}
          style={{width: '100%'}}
          refreshing={refreshing}
          onRefresh={onRefresh}
          keyExtractor={item => item.key}
          renderItem={({item}) => item.component}
        />
      </CourseListContainer>
    )
  }
}

const mapStateToProps = (state) => {
  const {filterStatus, favorites, userSites, isUpdatingFavorites} = state.tracsSites
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
    isUpdatingFavorites,
    favoritesFilterActive: filterStatus === FAVORITES,
    theme: state.theme
  }
}

const mapDispatchToProps = dispatch => ({
  getFavorites: () => dispatch(getFavorites()),
  updateFavorites: (ids) => dispatch(updateFavorites(ids))
})

export default connect(mapStateToProps, mapDispatchToProps)(CourseList)
