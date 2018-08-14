import React, {Component} from 'react'
import {ScrollView, RefreshControl} from 'react-native'

import {connect} from 'react-redux'
import styled from 'styled-components'
import Modal from 'react-native-modal'

import CourseCard from './CourseCard/CourseCard'
import CourseSkeletonCard from './CourseSkeletonCard'
import CourseScreen from '../CourseScreen/CourseScreen'

const CourseListContainer = styled.View`
	flex: 1;
	width: 100%;
`

const loadingSites = new Array(10).fill(0).map((item, index) => (
  <CourseSkeletonCard key={`${index}`} />
))

class CourseList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      y: 0,
      isVisible: false,
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

  renderCourses = () => {
    const {sites, loading, refreshing} = this.props

    return loading && !refreshing ?
      loadingSites :
      sites.map(item => (
        <CourseCard
          {...item}
          key={item.id}
          goToCourse={this.showModal(item)}
        />
      ))
  }

  showModal = (item) => () => {
    this.setState({isVisible: true, course: item})
  }

  hideModal = () => {
    this.setState({isVisible: false})
  }

  render() {
    const {refreshing, onRefresh, navigation, loading} = this.props
    const {isVisible, course} = this.state
    return (
      <CourseListContainer>
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {this.renderCourses()}
        </ScrollView>
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
  const sites = Object.keys(state.tracsSites.userSites).reduce((accum, siteId) => {
    accum.push(state.tracsSites.userSites[siteId])
    return accum
  }, []).filter(state.tracsSites.filter(state.tracsSites.favorites))

  return {
    sites
  }
}

export default connect(mapStateToProps, null)(CourseList)