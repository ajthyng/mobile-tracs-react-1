import React, { Component } from 'react'
import { Dimensions, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { toggleStatus } from '../../constants/sites'
import { getFavorites, updateFavorites } from '../../actions/sites'
import styled from 'styled-components'
import CourseCard from './CourseCard/CourseCard'
import CourseSkeletonCard from './CourseSkeletonCard'
import EmptyCourseList from './EmptyCourseList'
import HomeCard from './CourseCard/HomeCard'

const { FAVORITES } = toggleStatus

const Container = styled.View``

class CourseList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      scroll: true
    }
  }

  isFavorite = (id) => this.props.favorites.includes(id)

  updateFavorite = (id) => () => {
    const { favorites } = this.props

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
    const { navigation: { navigate } } = this.props

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
      const { favorites, sites: tracsSites, favoritesFilterActive, theme } = this.props

      if (favoritesFilterActive) {
        const colors = theme.colors.courseCard.colorBar || []
        const options = colors.length

        sites = tracsSites
          .filter(({ id }) => favorites.includes(id))
          .map((site, i) => ({ ...site, color: colors[i % options] }))
      } else {
        sites = tracsSites.map(site => ({ ...site, color: theme.colors.courseCard.defaultColorBar }))
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
              onPress={this.goToCourse(course)}
              onFavorite={this.updateFavorite(course.id)}
            />
          ),
          id: course.id
        }
      })
      if (favoritesFilterActive) {
        const { tracsID } = this.props
        const course = {
          id: tracsID,
          name: 'TRACS Home',
          contactInfo: { name: '', email: '' },
          color: '#501214'
        }
        sites.splice(0, 0,
          { card: <HomeCard course={course} key='0' />, id: '0' }
        )
      }
    }
    return sites
  }

  setScroll = (enabled) => {
    this.setState({ scroll: enabled })
  }

  renderItem = ({ item: { card } }) => {
    return card
  }

  render () {
    const { refreshing, onRefresh } = this.props
    const { scroll } = this.state
    let data = this.makeData()
    const noFavorites = data.length <= 1
    return (
      <Container>
        {noFavorites ? <EmptyCourseList /> : null}
        <FlatList
          extraData={this.props.favoritesFilterActive}
          refreshing={refreshing}
          onRefresh={onRefresh}
          data={data}
          renderItem={this.renderItem}
          keyExtractor={({ id }) => id}
          canCancelContentTouches={scroll}
          contentContainerStyle={{ flexGrow: 1, alignSelf: 'stretch' }}
        />
      </Container>
    )
  }
}

export const mapStateToProps = (state) => {
  const {
    tracsSites = {},
    notifications = {},
    theme = {},
    login = {}
  } = state || {}

  const {
    filterStatus = FAVORITES,
    favorites = [],
    userSites = {},
    isUpdatingFavorites = false
  } = tracsSites

  const { tracsID } = login
  const { badgeCounts = {} } = notifications
  const { defaultColorBar } = theme?.colors?.courseCard || {}

  const sites = Object.keys(userSites).reduce((accum, siteId) => {
    const hasNewContent = (badgeCounts[siteId] || {}).unseenCount > 0
    const { mappedGrade = null, calculatedGrade = null } = (state.grades[siteId] || {})
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
    tracsID,
    theme
  }
}

const mapDispatchToProps = dispatch => ({
  getFavorites: () => dispatch(getFavorites()),
  updateFavorites: (ids) => dispatch(updateFavorites(ids))
})

export default connect(mapStateToProps, mapDispatchToProps)(CourseList)
