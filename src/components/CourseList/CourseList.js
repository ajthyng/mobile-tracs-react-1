import React, {Component} from 'react'
import {Dimensions, FlatList} from 'react-native'
import {connect} from 'react-redux'
import {toggleStatus} from '../../constants/sites'
import {getFavorites, updateFavorites} from '../../actions/sites'

import CourseCard from './CourseCard/CourseCard'
import CourseSkeletonCard from './CourseSkeletonCard'
import EmptyCourseList from './EmptyCourseList'

const {FAVORITES} = toggleStatus

class CourseList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      scroll: true
    }
  }

  isFavorite = (id) => this.props.favorites.includes(id)

  updateFavorite = (id) => () => {
    const {favorites} = this.props

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
      course,
      updateFavorites: this.updateFavorite(course.id)
    })
  }

  makeData = () => {
    let sites = []
    if (this.props.sites.length === 0 && this.props.loading) {
      const cardsToRender = Math.floor(1.2 * Dimensions.get('window').height / 80)
      for (let i = 0; i < cardsToRender; i++) {
        const id = i.toString(10)
        sites.push({
          card: (<CourseSkeletonCard />),
          id
        })
      }
    } else {
      const {favorites, sites: tracsSites, favoritesFilterActive, theme} = this.props

      if (favoritesFilterActive) {
        const colors = theme.colors.courseCard.colorBar || []
        const options = colors.length

        sites = tracsSites
          .filter(({id}) => favorites.includes(id))
          .map((site, i) => ({...site, color: colors[i % options]}))
      } else {
        sites = tracsSites.map(site => ({...site, color: theme.colors.courseCard.defaultColorBar}))
      }

      sites = sites.map((course, index) => {
        const isFavorite = this.isFavorite(course.id)
        return {
          card: (
            <CourseCard
              key={course.id}
              course={course}
              setScroll={this.setScroll}
              isFavorite={isFavorite}
              updateFavorite={this.updateFavorite}
              onPress={this.goToCourse(course)}
              onFavorite={this.updateFavorite(course.id)}
            />
          ),
          id: course.id
        }
      })
    }
    return sites
  }

  setScroll = (enabled) => {
    this.setState({scroll: enabled})
  }

  renderItem = ({item: {card}}) => {
    return card
  }

  render () {
    const {refreshing, onRefresh} = this.props
    const {scroll} = this.state
    let data = this.makeData()

    return (
      <FlatList
        extraData={this.props.favoritesFilterActive}
        refreshing={refreshing}
        onRefresh={onRefresh}
        data={data}
        ListEmptyComponent={EmptyCourseList}
        renderItem={this.renderItem}
        keyExtractor={({id}) => id}
        canCancelContentTouches={scroll}
        contentContainerStyle={{flexGrow: 1, alignSelf: 'stretch'}}
      />
    )
  }
}

const mapStateToProps = (state) => {
  const {filterStatus, favorites, userSites, isUpdatingFavorites} = state.tracsSites
  const {badgeCounts} = state.notifications
  const {defaultColorBar} = state.theme.colors.courseCard

  const sites = Object.keys(userSites).reduce((accum, siteId) => {
    const hasNewContent = (badgeCounts[siteId] || {}).unseenCount > 0
    const {mappedGrade, calculatedGrade} = (state.grades[siteId] || {})
    accum.push({
      ...userSites[siteId],
      hasNewContent,
      color: defaultColorBar,
      mappedGrade,
      calculatedGrade,
      isFavorite: favorites.includes(siteId)
    })
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
