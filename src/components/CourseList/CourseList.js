import React, {Component} from 'react'

import {connect} from 'react-redux'
import styled from 'styled-components'
import Modal from 'react-native-modal'
import {toggleStatus} from '../../constants/sites'

import CourseCard from './CourseCard/CourseCard'
import CourseSkeletonCard from './CourseSkeletonCard'
import CourseScreen from '../CourseScreen/CourseScreen'

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
  constructor () {
    super()
    this.state = {
      y: 0,
      isVisible: false,
      scroll: true,
      course: {}
    }

    this.modalAnimation = {
      from: { scale: 0, opacity: 0 },
      to: { scale: 1, opacity: 1 }
    }

    this.modalStyle = {
      marginTop: 55,
      marginBottom: 55,
      marginLeft: 20,
      marginRight: 20
    }
  }

  renderCourse = (setScroll) => ({item}) => {
    return <CourseCard {...item} goToCourse={this.showModal(item)} setScroll={setScroll} />
  }

  showModal = (item) => () => {
    this.setState({isVisible: true, course: item})
  }

  hideModal = () => {
    this.setState({isVisible: false})
  }

  setScroll = (enabled) => {
    this.setState({scroll: enabled})
  }

  render () {
    const {refreshing, onRefresh, navigation} = this.props
    const {isVisible, course} = this.state
    return (
      <CourseListContainer>
        <Courses
          data={this.props.sites}
          canCancelContentTouches={this.state.scroll}
          contentContainerStyle={{marginTop: 10, marginBottom: 10, marginLeft: 0, marginRight: 0}}
          style={{width: '100%'}}
          keyExtractor={item => item.id}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={this.renderCourse(this.setScroll)}
        />
        <Modal
          isVisible={isVisible}
          onBackButtonPress={this.hideModal}
          onBackdropPress={this.hideModal}
          swipeDirection='down'
          onSwipe={this.hideModal}
          animationIn={this.modalAnimation}
          style={this.modalStyle}
        >
          <CourseScreen
            course={course}
            navigation={navigation}
            dismiss={this.hideModal}
          />
        </Modal>
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
    theme: state.theme
  }
}

export default connect(mapStateToProps, null)(CourseList)
